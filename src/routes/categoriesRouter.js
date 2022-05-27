import { Router } from "express";
import validCategoryBody from "../middlewares/validCategoryBody.js";

import { addCategory } from "../controllers/categoriesController.js";

const categoryRouter = Router();

categoryRouter.post("/categories", validCategoryBody, addCategory);

export default categoryRouter;
