
import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/hotelActivities.js";
import type { SupplierHotel, HotelOffer, SupplierName } from "../types/hotel.js";

const {
  fetchSupplierAHotels,
  fetchSupplierBHotels
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 seconds"
});

export async function hotelWorkflow(city: string): Promise<HotelOffer[]> {

  // Fetch both suppliers in parallel
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierAHotels(city),
    fetchSupplierBHotels(city)
  ]);

  // Store the best offer for each hotel
  const bestOffers = new Map<string, HotelOffer>();

  // Process Supplier A and Supplier B results
  const allHotels: {
    hotel: SupplierHotel;
    supplier: SupplierName;
  }[] = [
    ...supplierAHotels.map(hotel => ({
      hotel,
      supplier: "Supplier A" as const
    })),
    ...supplierBHotels.map(hotel => ({
      hotel,
      supplier: "Supplier B" as const
    }))
  ];

  for (const item of allHotels) {
    const hotel = item.hotel;
    const supplier = item.supplier;

    const hotelName = hotel.name.trim().toLowerCase();

    const currentOffer: HotelOffer = {
      name: hotel.name,
      price: hotel.price,
      supplier,
      commissionPct: hotel.commissionPct
    };

    const existingOffer = bestOffers.get(hotelName);

    // Keep the cheaper offer
    if (!existingOffer || currentOffer.price < existingOffer.price) {
      bestOffers.set(hotelName, currentOffer);
    }
  }

  // Convert Map values into an array
  return Array.from(bestOffers.values());
}
