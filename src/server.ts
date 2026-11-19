
import express from "express";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Create Express application
const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Get port from environment variables
const PORT = Number(process.env.PORT) || 3000;

// First endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Hotel Offer Orchestrator API",
        status: "Server is running"
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Hotel Offer Orchestrator is healthy"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
