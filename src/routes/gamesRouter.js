import { Router } from "express";

import { addGame } from "../controllers/gamesController.js";
import validGamesBody from "../middlewares/validGamesBody.js";

const gamesRouter = Router();

gamesRouter.post("/games", validGamesBody, addGame);

export default gamesRouter;
