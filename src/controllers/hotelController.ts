
import type { Request, Response, NextFunction } from "express";

import { getHotelsByCity } from "../services/hotelService.js";

// Controller for GET /api/hotels
export async function getHotels(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {

        // Extract city from query parameters
        const city = req.query.city;

        // Validate city
        if (typeof city !== "string" || city.trim() === "") {
            res.status(400).json({
                error: "Please provide a valid city"
            });
            return;
        }

        // Call service
        const hotels = await getHotelsByCity(city.trim());

        // Send response
        res.status(200).json(hotels);

    } catch (error) {

        // Pass error to Express error handler
        next(error);

    }
}
