import { SuppliersUnavailableError } from "../errors/SuppliersUnavailableError.js";
import type { Request, Response, NextFunction } from "express";
import { getHotelsByCity } from "../services/hotelService.js";

export async function getHotels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Read query parameters
    const city = req.query.city;
    const minPriceQuery = req.query.minPrice;
    const maxPriceQuery = req.query.maxPrice;

    // Validate city
    if (typeof city !== "string" || city.trim() === "") {
      return res.status(400).json({
        error: "Please provide a valid city"
      });
    }

    // Check whether both price parameters are provided
    const hasMinPrice = minPriceQuery !== undefined;
    const hasMaxPrice = maxPriceQuery !== undefined;

    if (hasMinPrice !== hasMaxPrice) {
      return res.status(400).json({
        error: "Please provide both minPrice and maxPrice"
      });
    }

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    // Validate and convert price parameters
    if (hasMinPrice && hasMaxPrice) {
      if (
        typeof minPriceQuery !== "string" ||
        typeof maxPriceQuery !== "string" ||
        minPriceQuery.trim() === "" ||
        maxPriceQuery.trim() === ""
      ) {
        return res.status(400).json({
          error: "Prices must be valid numbers"
        });
      }

      minPrice = Number(minPriceQuery);
      maxPrice = Number(maxPriceQuery);

      if (
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        minPrice < 0 ||
        maxPrice < 0
      ) {
        return res.status(400).json({
          error: "Prices must be non-negative numbers"
        });
      }

      if (minPrice > maxPrice) {
        return res.status(400).json({
          error: "minPrice cannot be greater than maxPrice"
        });
      }
    }

    // Call the hotel service
    const hotels = await getHotelsByCity(
      city.trim(),
      minPrice,
      maxPrice
    );

    return res.status(200).json(hotels);

  } catch (error) {
    if (error instanceof SuppliersUnavailableError) {
      return res.status(503).json({
        error: error.message
      });
    }

    next(error);
  }
}
