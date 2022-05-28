import { Router } from "express";

import validCategoryBody from "../middlewares/validCategoryBody.js";

import {
  addCategory,
  getCategories,
} from "../controllers/categoriesController.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);

categoryRouter.post("/categories", validCategoryBody, addCategory);

export default categoryRouter;
