
import type { SupplierHotel } from "../types/hotel.js";

// Mock data provided by Supplier A
const supplierAHotels: SupplierHotel[] = [
    {
        hotelId: "a1",
        name: "Holtin",
        price: 6000,
        city: "delhi",
        commissionPct: 10
    },
    {
        hotelId: "a2",
        name: "Radison",
        price: 5900,
        city: "delhi",
        commissionPct: 13
    },
    {
        hotelId: "a3",
        name: "Taj Palace",
        price: 9000,
        city: "delhi",
        commissionPct: 15
    },
    {
        hotelId: "a4",
        name: "The Leela",
        price: 11000,
        city: "delhi",
        commissionPct: 12
    },
    {
        hotelId: "a5",
        name: "Marine Hotel",
        price: 7500,
        city: "mumbai",
        commissionPct: 11
    }
];

// Return hotels for the requested city
export function getSupplierAHotels(city: string): SupplierHotel[] {

    return supplierAHotels.filter(
        hotel => hotel.city === city.toLowerCase().trim()
    );

}
