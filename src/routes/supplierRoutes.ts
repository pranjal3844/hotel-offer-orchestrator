
import { Router } from "express";

import {
    getSupplierAHotels
} from "../suppliers/suppliersA.js";

import {
    getSupplierBHotels
} from "../suppliers/suppliersB.js";

const router = Router();

// Supplier A API
router.get("/supplierA/hotels", (req, res) => {

    const city = req.query.city;

    if (typeof city !== "string" || city.trim() === "") {
        res.status(400).json({
            error: "Please provide a valid city"
        });
        return;
    }

    const hotels = getSupplierAHotels(city);

    res.status(200).json(hotels);

});

// Supplier B API
router.get("/supplierB/hotels", (req, res) => {

    const city = req.query.city;

    if (typeof city !== "string" || city.trim() === "") {
        res.status(400).json({
            error: "Please provide a valid city"
        });
        return;
    }

    const hotels = getSupplierBHotels(city);

    res.status(200).json(hotels);

});

export default router;
