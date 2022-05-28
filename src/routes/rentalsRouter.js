import { Router } from "express";

import {
  addRental,
  getRentals,
  returnRental,
} from "../controllers/rentalsController.js";
import validRentalBody from "../middlewares/validRentalBody.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);

rentalsRouter.post("/rentals", validRentalBody, addRental);

rentalsRouter.post("/rentals/:id/return", returnRental);

export default rentalsRouter;
