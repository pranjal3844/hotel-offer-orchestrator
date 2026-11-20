
export type SupplierName = "Supplier A" | "Supplier B";

// Structure received from supplier APIs
export interface SupplierHotel {
    hotelId: string;
    name: string;
    price: number;
    city: string;
    commissionPct: number;
}

// Structure returned by our aggregator
export interface HotelOffer {
    name: string;
    price: number;
    supplier: SupplierName;
    commissionPct: number;
}
