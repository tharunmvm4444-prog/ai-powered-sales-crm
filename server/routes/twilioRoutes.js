const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const https = require("https");
const { analyzeAudio } = require("../services/aiService");
const Lead = require("../models/Lead");
const mongoose = require("mongoose");

// Ensure recordings directory exists
const recordingsDir = path.join(__dirname, "../recordings");
if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
}

// POST /api/twilio/make-call - Initiate a call to the verified number
router.post("/make-call", async (req, res) => {
    console.log("Twilio make-call route hit!");
    try {
        const destinationNumber = "+919952380115";
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !twilioPhoneNumber) {
            return res.status(500).json({
                success: false,
                message: "Twilio credentials not configured. Please check .env file.",
            });
        }

        const twilio = require("twilio");
        const client = twilio(accountSid, authToken);

        const { leadId, customerName } = req.body;

        // Make the call with interactive TwiML (Matches demo project)
        const call = await client.calls.create({
            to: destinationNumber,
            from: twilioPhoneNumber,
            twiml: `
                <Response>
                    <Say>Hello. This is the sales representative. Please tell us about your requirement so we can assist you better.</Say>
                    <Record maxLength="60" playBeep="true" />
                    <Say>Thank you for your response. We will get back to you soon. Goodbye.</Say>
                </Response>
            `,
            // NOT using record: true here as per demo behavior
            statusCallback: `${process.env.BASE_URL || "http://localhost:5050"}/api/twilio/call-status`,
            statusCallbackEvent: ["completed"],
        });

        // Safe update with try-catch to prevent any CastError or DB error from crashing the request
        try {
            if (leadId && mongoose.Types.ObjectId.isValid(leadId)) {
                await Lead.findByIdAndUpdate(leadId, { callSid: call.sid });
                console.log(`[Twilio] Linked Call SID ${call.sid} to Lead ID ${leadId}`);
            } else {
                console.warn(`[Twilio] Skipped linking Call SID ${call.sid} to Lead ID ${leadId} (Invalid ID)`);
            }
        } catch (dbError) {
            console.error(`[Twilio] Database link error for leadId "${leadId}":`, dbError.message);
            // Non-fatal error, continue
        }

        console.log(`Call initiated to ${destinationNumber} - SID: ${call.sid}`);
        res.json({
            success: true,
            message: `Call initiated to ${destinationNumber}`,
            callSid: call.sid,
            status: call.status,
        });
    } catch (error) {
        console.error("Error making call:", error);
        res.status(500).json({ success: false, message: "Failed to initiate call", error: error.message });
    }
});

// GET /api/twilio/recording/:sid - Fetch, Download, and Analyze recording (Matches demo project)
router.get("/recording/:sid", async (req, res) => {
    const { sid } = req.params;
    console.log(`[Twilio] Fetching recording for Call SID: ${sid}`);

    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilio = require("twilio");
        const client = twilio(accountSid, authToken);

        // List recordings for this call
        const recordings = await client.recordings.list({ callSid: sid });

        if (!recordings.length) {
            return res.json({ success: false, message: "Recording not found yet. Please wait a few seconds after the call ends." });
        }

        // Use the first recording found
        const recording = recordings[0];
        const recordingUrl = `https://api.twilio.com${recording.uri.replace(".json", ".mp3")}`;
        const filePath = path.join(recordingsDir, `${sid}.mp3`);
        const file = fs.createWriteStream(filePath);

        console.log(`[Twilio] Downloading recording from: ${recordingUrl}`);

        // Download logic with Twilio Auth
        const downloadFile = (url) => {
            const options = {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
                }
            };

            https.get(url, options, (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    return downloadFile(response.headers.location);
                }

                if (response.statusCode !== 200) {
                    return res.status(response.statusCode).json({ success: false, message: "Failed to download recording from Twilio" });
                }

                response.pipe(file);
                file.on("finish", async () => {
                    file.close();
                    console.log(`[Twilio] Saved recording to: ${filePath}`);

                    // Analyze with AI (Gemini)
                    console.log("[AI] Analyzing with Gemini 1.5 Flash...");
                    const analysis = await analyzeAudio(filePath);

                    res.json({
                        success: true,
                        message: "Recording analyzed successfully!",
                        localPath: filePath,
                        analysis: analysis
                    });

                    // Save to DB
                    try {
                        await Lead.findOneAndUpdate(
                            { callSid: sid },
                            {
                                sentiment: analysis.sentiment,
                                callDescription: analysis.description,
                                aiFeedback: analysis.feedback
                            }
                        );
                        console.log(`[Twilio] Updated Lead with AI analysis for Call SID: ${sid}`);
                    } catch (dbErr) {
                        console.error("[Twilio] Failed to update Lead with analysis:", dbErr);
                    }
                });
            }).on("error", (err) => {
                console.error("[Twilio] Download error:", err);
                res.status(500).json({ success: false, error: err.message });
            });
        };

        downloadFile(recordingUrl);

    } catch (error) {
        console.error("Error in fetching recording:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/twilio/end-call - Terminate an active call
router.post("/end-call", async (req, res) => {
    const { sid } = req.body;
    if (!sid) {
        return res.status(400).json({ success: false, message: "Call SID is required" });
    }

    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilio = require("twilio");
        const client = twilio(accountSid, authToken);

        await client.calls(sid).update({ status: "completed" });
        console.log(`[Twilio] Call ${sid} terminated by user.`);
        res.json({ success: true, message: "Call terminated successfully" });
    } catch (error) {
        console.error("Error ending call:", error);
        res.status(500).json({ success: false, message: "Failed to end call", error: error.message });
    }
});

// Webhook for call status (logs only)
router.post("/call-status", (req, res) => {
    const { CallSid, CallStatus } = req.body;
    console.log(`[Twilio] Call Status: ${CallStatus} (SID: ${CallSid})`);
    res.sendStatus(200);
});

module.exports = router;
