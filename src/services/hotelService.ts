
import type { HotelOffer } from "../types/hotel.js";

// Fetch hotels for a particular city
export async function getHotelsByCity(
    city: string
): Promise<HotelOffer[]> {

    console.log(`Fetching hotels for city: ${city}`);

    // Temporary empty result.
    // Actual supplier integration will be implemented later.

    return [];
}
