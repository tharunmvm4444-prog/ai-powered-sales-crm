const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const path = require("path");

// Setup Gemini API Key
const apiKey = "AIzaSyAEJ2fUgCRZoHJrypD01pBKtFSeNryRMss";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function analyzeTranscript(transcript) {
    try {
        console.log(`[AI] Starting analysis for transcript...`);

        // Select the model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // Generate content
        const result = await model.generateContent([
            `Analyze the following conversation transcript between a salesperson and a customer. 
            Provide a brief description (10 -15 words), determine the sentiment, and give feedback.
            
            Transcript: "${transcript}"
      
            Output strictly valid JSON with the following schema:
            {
              "description": "Brief description of the call 10 to 15 words",
              "sentiment": "Positive" or "Negative"
            }`,
        ]);

        const jsonResponse = result.response.text();
        const parsedData = JSON.parse(jsonResponse);

        console.log("\n--- AI Analysis Results ---");
        console.log(`Sentiment: ${parsedData.sentiment}`);
        console.log(`Description: ${parsedData.description}`);
        console.log(`Feedback: ${parsedData.feedback}`);
        console.log("---------------------------\n");

        return parsedData;
    } catch (error) {
        console.error("[AI] Error analyzing transcript:", error);
        return null;
    }
}

async function analyzeAudio(filePath, mimeType = "audio/mpeg") {
    try {
        console.log(`[AI] Starting audio analysis for: ${filePath}`);

        // 1. Upload the audio file to Google AI
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: mimeType,
            displayName: "Twilio Call Recording",
        });

        const fileName = uploadResult.file.name;
        console.log(`[AI] Uploaded file: ${fileName}. Waiting for processing...`);

        // 2. Poll for file state to be "ACTIVE" (Crucial for audio analysis)
        let file = await fileManager.getFile(fileName);
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(fileName);
        }

        if (file.state === "FAILED") {
            throw new Error("Audio file processing failed on Google AI servers.");
        }

        console.log(`\n[AI] File is now ACTIVE: ${file.uri}`);

        // 3. Select the stable model
        const modelName = "gemini-2.5-flash";
        console.log(`[AI] Using model: ${modelName}`);

        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // 4. Generate content with the processed audio data
        const result = await model.generateContent([
            {
                fileData: {
                    fileUri: file.uri,
                    mimeType: file.mimeType,
                },
            },
            {
                text: `You are an expert sales analyst. Listen to this recording of a call between a salesperson and a client.
            
            Based ONLY on the audio, provide:
            1. A brief description of the conversation (30-40 words).
            2. Determine the overall sentiment (Positive or Negative).
            3. Provide constructive feedback for the salesperson to improve their pitch or handling.
      
            Output strictly valid JSON with the following schema:
            {
              "description": "Brief description of the call",
              "feedback": "Detailed feedback for the salesperson",
              "sentiment": "Positive" or "Negative"
            }`,
            },
        ]);

        const jsonResponse = result.response.text();
        const parsedData = JSON.parse(jsonResponse);

        console.log("\n--- AI Audio Analysis Results ---");
        console.log(`Sentiment: ${parsedData.sentiment}`);
        console.log(`Description: ${parsedData.description}`);
        console.log(`Feedback: ${parsedData.feedback}`);
        console.log("---------------------------------\n");

        return parsedData;
    } catch (error) {
        console.error("[AI] Error analyzing audio:", error);
        return null;
    }
}

// If we want to use the file-based approach (multimodal), we can add it here too.
// For now, let's start with a simpler approach or direct integration if Twilio provides transcript.
// Actually, Twilio recordings need to be downloaded first if we want Gemini to listen to them.

module.exports = { analyzeTranscript, analyzeAudio };
