import { ApplicationFailure } from "@temporalio/common";
import { log, proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities/hotelActivities.js";
import type {
  SupplierHotel,
  HotelOffer,
  SupplierName
} from "../types/hotel.js";

const {
  fetchSupplierAHotels,
  fetchSupplierBHotels
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 seconds",
  retry: {
    initialInterval: "1 second",
    maximumInterval: "10 seconds",
    backoffCoefficient: 2,
    maximumAttempts: 3
  }
});

export async function hotelWorkflow(city: string): Promise<HotelOffer[]> {

  // Fetch both suppliers independently
  const [supplierAResult, supplierBResult] = await Promise.allSettled([
    fetchSupplierAHotels(city),
    fetchSupplierBHotels(city)
  ]);

  // Check Supplier A result
  let supplierAHotels: SupplierHotel[] = [];

  if (supplierAResult.status === "fulfilled") {
    supplierAHotels = supplierAResult.value;
  } else {
    log.warn("Supplier A failed. Continuing with available results.");
  }

  // Check Supplier B result
  let supplierBHotels: SupplierHotel[] = [];

  if (supplierBResult.status === "fulfilled") {
    supplierBHotels = supplierBResult.value;
  } else {
    log.warn("Supplier B failed. Continuing with available results.");
  }

// Check whether both suppliers failed
  if (
    supplierAResult.status === "rejected" &&
    supplierBResult.status === "rejected"
  ) {
    log.error("Both suppliers failed. Cannot fetch hotel offers.");

    throw ApplicationFailure.create({
      message: "Both hotel suppliers are unavailable",
      type: "BOTH_SUPPLIERS_UNAVAILABLE",
      nonRetryable: true
    });
  }

  // Store the best offer for each hotel
  const bestOffers = new Map<string, HotelOffer>();

  // Combine both supplier results
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

  // Deduplicate hotels and select the cheaper offer
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

    if (!existingOffer || currentOffer.price < existingOffer.price) {
      bestOffers.set(hotelName, currentOffer);
    }
  }

  // Return available deduplicated offers
  return Array.from(bestOffers.values());
}
