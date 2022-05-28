import { Router } from "express";

import { addRental } from "../controllers/rentalsController.js";
import validRentalBody from "../middlewares/validRentalBody.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validRentalBody, addRental);

export default rentalsRouter;
