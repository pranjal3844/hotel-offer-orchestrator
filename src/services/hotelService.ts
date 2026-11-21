

import type { HotelOffer } from "../types/hotel.js";
import { runHotelWorkflow } from "../temporal/client.js";
import {
  saveHotels,
  filterHotelsByPrice
} from "./redisHotelService.js";

export async function getHotelsByCity(
  city: string,
  minPrice?: number,
  maxPrice?: number
): Promise<HotelOffer[]> {

  // Fetch deduplicated hotels through Temporal
  const hotels = await runHotelWorkflow(city);

  // Save all deduplicated hotels in Redis
  await saveHotels(city, hotels);

  // Filter inside Redis if a price range is provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    return await filterHotelsByPrice(city, minPrice, maxPrice);
  }

  // Return all deduplicated hotels
  return hotels;
}

