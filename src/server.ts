import "./config/redis.js";
import express, {type ErrorRequestHandler } from "express";
import dotenv from "dotenv";

import hotelRoutes from "./routes/hotelRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Main route
app.use("/api", hotelRoutes);

// Mock supplier routes
app.use("/", supplierRoutes);

// Home endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Hotel Offer Orchestrator API",
        status: "Server is running"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Hotel Offer Orchestrator is healthy"
    });
});

// Central error-handling middleware
const errorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    console.error("Application error:", err);

    res.status(500).json({
        error: "Internal server error"
    });
};

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
