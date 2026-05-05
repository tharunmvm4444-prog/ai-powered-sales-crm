const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config(); // <-- MUST be before connectDB
connectDB();

const app = express();

/* ✅ CORS MUST BE FIRST */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* ✅ JSON AFTER CORS */
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/twilio", require("./routes/twilioRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 8000;

console.log(`Attempting to start server on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} is already in use.`);
    console.error(`Please stop the existing server on port ${PORT} or check if another application is using it.`);
    process.exit(1);
  } else {
    console.error('Server failed to start:', e);
  }
});
