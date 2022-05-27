import { Router } from "express";

import { addGame, getGames } from "../controllers/gamesController.js";
import validGamesBody from "../middlewares/validGamesBody.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);

gamesRouter.post("/games", validGamesBody, addGame);

export default gamesRouter;
