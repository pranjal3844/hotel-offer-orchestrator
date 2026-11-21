
import redis from "../config/redis.js";
import type { HotelOffer } from "../types/hotel.js";

// Save deduplicated hotels in Redis
export async function saveHotels(
  city: string,
  hotels: HotelOffer[]
): Promise<void> {
  const key = `hotels:${city.toLowerCase().trim()}`;

  // Remove previous results for this city
  await redis.del(key);

  // Don't execute ZADD if there are no hotels
  if (hotels.length === 0) {
    return;
  }

  // Prepare price and hotel data pairs
  const redisData = hotels.flatMap((hotel) => [
    hotel.price,
    JSON.stringify(hotel)
  ]);

  // Save hotels in a Sorted Set zddddddddd.......
  await redis.zadd(key, ...redisData);
}

// Retrieve hotels within a price range
export async function filterHotelsByPrice(
  city: string,
  minPrice: number,
  maxPrice: number
): Promise<HotelOffer[]> {
  const key = `hotels:${city.toLowerCase().trim()}`;

  // Ask Redis to filter hotels by their price scores
  const results = await redis.zrangebyscore(
    key,
    minPrice,
    maxPrice
  );

  // Convert stored JSON strings back into objects
  return results.map((hotel) => JSON.parse(hotel) as HotelOffer);
}
