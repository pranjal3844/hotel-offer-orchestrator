import type { SupplierHotel } from "../types/hotel.js";
import { runHotelWorkflow } from "../temporal/client.js";

interface SupplierResults {
  supplierAHotels: SupplierHotel[];
  supplierBHotels: SupplierHotel[];
}

export async function getHotelsByCity(
  city: string
): Promise<SupplierResults> {
  const result = await runHotelWorkflow(city);

  return result;
}

