import { Router } from "express";

import { addRental, getRentals } from "../controllers/rentalsController.js";
import validRentalBody from "../middlewares/validRentalBody.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);

rentalsRouter.post("/rentals", validRentalBody, addRental);

export default rentalsRouter;
