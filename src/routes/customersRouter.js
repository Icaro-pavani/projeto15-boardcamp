import { Router } from "express";

import {
  addCustomer,
  getCustomers,
} from "../controllers/customersController.js";
import validCustomerBody from "../middlewares/validCustomerBody.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);

customersRouter.post("/customers", validCustomerBody, addCustomer);

export default customersRouter;
