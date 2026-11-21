
import "dotenv/config";
import { Redis } from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT ?? 6379)
});

// Listen for Redis connection errors
redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});

// Confirm successful connection
redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

export default redis;
