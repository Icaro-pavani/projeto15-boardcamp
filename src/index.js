import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoryRouter from "./routes/categoriesRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(categoryRouter);

app.listen(process.env.PORT, () => {
  console.log("App online on port " + process.env.PORT);
});
