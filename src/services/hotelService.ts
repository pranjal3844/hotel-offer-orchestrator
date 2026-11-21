
import type { HotelOffer } from "../types/hotel.js";
import { runHotelWorkflow } from "../temporal/client.js";

export async function getHotelsByCity(
  city: string
): Promise<HotelOffer[]> {
  const result = await runHotelWorkflow(city);

  return result;
}

