import "dotenv/config";

import {
  Client,
  Connection,
  WorkflowFailedError
} from "@temporalio/client";

import { ApplicationFailure } from "@temporalio/common";
import { randomUUID } from "node:crypto";

import { SuppliersUnavailableError } from "../errors/SuppliersUnavailableError.js";

// Store the client so we can reuse the same connection
let temporalClient: Client | undefined;

// Create or reuse the Temporal Client
async function getTemporalClient(): Promise<Client> {
  if (!temporalClient) {
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS ?? "localhost:7233"
    });

    temporalClient = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE ?? "default"
    });
  }

  return temporalClient;
}

// Start the Hotel Workflow and wait for its result
export async function runHotelWorkflow(city: string) {
  const client = await getTemporalClient();

  try {
    const result = await client.workflow.execute("hotelWorkflow", {
      workflowId: `hotel-offers-${city}-${randomUUID()}`,
      taskQueue: process.env.HOTEL_TASK_QUEUE ?? "hotel-task-queue",
      args: [city]
    });

    return result;

  } catch (error) {
    if (
      error instanceof WorkflowFailedError &&
      error.cause instanceof ApplicationFailure &&
      error.cause.type === "BOTH_SUPPLIERS_UNAVAILABLE"
    ) {
      throw new SuppliersUnavailableError();
    }

    throw error;
  }
}