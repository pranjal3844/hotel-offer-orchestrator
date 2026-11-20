
import { Router } from "express";

import { getHotels } from "../controllers/hotelController.js";

// Create a separate router
const router = Router();

// GET /hotels
router.get("/hotels", getHotels);

export default router;
