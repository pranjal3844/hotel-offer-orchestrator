
import type { SupplierHotel } from "../types/hotel.js";

const BASE_URL = "http://localhost:3000";

// Activity 1: Fetch hotels from Supplier A
export async function fetchSupplierAHotels(
  city: string
): Promise<SupplierHotel[]> {
  const response = await fetch(
    `${BASE_URL}/supplierA/hotels?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error(
      `Supplier A request failed with status ${response.status}`
    );
  }

  const hotels = (await response.json()) as SupplierHotel[];

  return hotels;
}

// Activity 2: Fetch hotels from Supplier B
export async function fetchSupplierBHotels(
  city: string
): Promise<SupplierHotel[]> {
  const response = await fetch(
    `${BASE_URL}/supplierB/hotels?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error(
      `Supplier B request failed with status ${response.status}`
    );
  }

  const hotels = (await response.json()) as SupplierHotel[];

  return hotels;
}
