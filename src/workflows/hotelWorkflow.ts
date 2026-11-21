
import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/hotelActivities.js";
import type { SupplierHotel } from "../types/hotel.js";

// Create proxies for our Activities
const {
  fetchSupplierAHotels,
  fetchSupplierBHotels
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 seconds"
});

// Main Hotel Workflow
export async function hotelWorkflow(city: string): Promise<{
  supplierAHotels: SupplierHotel[];
  supplierBHotels: SupplierHotel[];
}> {

  // Call both suppliers in parallel
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierAHotels(city),
    fetchSupplierBHotels(city)
  ]);

  // Return both supplier results
  return {
    supplierAHotels,
    supplierBHotels
  };
}
