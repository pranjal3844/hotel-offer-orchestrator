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

// Check the health of an individual supplier
const checkSupplier = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000)
    });

    return response.ok ? "healthy" : "unhealthy";
  } catch {
    return "unhealthy";
  }
};

// Get the health status of both suppliers
const getSupplierHealth = async () => {
  const baseUrl = `http://localhost:${PORT}`;

  const [supplierA, supplierB] = await Promise.all([
    checkSupplier(`${baseUrl}/supplierA/hotels?city=delhi`),
    checkSupplier(`${baseUrl}/supplierB/hotels?city=delhi`)
  ]);

  return {
    supplierA,
    supplierB,
    allHealthy: supplierA === "healthy" && supplierB === "healthy"
  };
};

// Main health endpoint
app.get("/health", async (req, res) => {
  const health = await getSupplierHealth();

  res.status(health.allHealthy ? 200 : 503).json({
    status: health.allHealthy ? "healthy" : "degraded",
    suppliers: {
      supplierA: health.supplierA,
      supplierB: health.supplierB
    }
  });
});

// Separate supplier health endpoint
app.get("/health/suppliers", async (req, res) => {
  const health = await getSupplierHealth();

  res.status(health.allHealthy ? 200 : 503).json({
    status: health.allHealthy ? "healthy" : "degraded",
    suppliers: {
      supplierA: health.supplierA,
      supplierB: health.supplierB
    }
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
