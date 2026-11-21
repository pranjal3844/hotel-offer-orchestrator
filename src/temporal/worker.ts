
import "dotenv/config";

import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "../activities/hotelActivities.js";
import { fileURLToPath } from "node:url";

async function run() {
  // Connect to the Temporal Server
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS ?? "localhost:7233"
  });

  // Create the Temporal Worker
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE ?? "default",
    taskQueue: process.env.HOTEL_TASK_QUEUE ?? "hotel-task-queue",

    // Tell Temporal where our Workflow is located
    workflowsPath: fileURLToPath(
      new URL("../workflows/hotelWorkflow.ts", import.meta.url)
    ),

    // Register the Activities that this Worker can execute
    activities
  });

  console.log("Hotel Temporal Worker started!");
  console.log("Listening on task queue: hotel-task-queue");

  // Start listening for tasks
  await worker.run();
}

// Start the Worker
run().catch((error) => {
  console.error("Worker failed:", error);
  process.exit(1);
});
