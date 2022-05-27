import { Router } from "express";

import {
  addCustomer,
  getCustomerById,
  getCustomers,
} from "../controllers/customersController.js";
import validCustomerBody from "../middlewares/validCustomerBody.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);

customersRouter.get("/customers/:id", getCustomerById);

customersRouter.post("/customers", validCustomerBody, addCustomer);

export default customersRouter;
