
import type { SupplierHotel } from "../types/hotel.js";

// Mock data provided by Supplier B
const supplierBHotels: SupplierHotel[] = [
    {
        hotelId: "b1",
        name: "Holtin",
        price: 5340,
        city: "delhi",
        commissionPct: 20
    },
    {
        hotelId: "b2",
        name: "Radison",
        price: 6200,
        city: "delhi",
        commissionPct: 18
    },
    {
        hotelId: "b3",
        name: "Taj Palace",
        price: 8500,
        city: "delhi",
        commissionPct: 17
    },
    {
        hotelId: "b4",
        name: "Grand Hyatt",
        price: 7200,
        city: "delhi",
        commissionPct: 14
    },
    {
        hotelId: "b5",
        name: "Marine Hotel",
        price: 7000,
        city: "mumbai",
        commissionPct: 16
    }
];

// Return hotels for the requested city
export function getSupplierBHotels(city: string): SupplierHotel[] {

    return supplierBHotels.filter(
        hotel => hotel.city === city.toLowerCase().trim()
    );

}
