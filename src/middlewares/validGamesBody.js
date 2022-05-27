import { stripHtml } from "string-strip-html";

import db from "../db.js";
import gamesSchema from "../schemas/gamesSchema.js";

export default async function validGamesBody(req, res, next) {
  try {
    const { name, image } = req.body;
    const gameBody = {
      ...req.body,
      name: stripHtml(name).result.trim(),
      image: stripHtml(image).result.trim(),
    };

    const gameValidation = await gamesSchema.validateAsync(gameBody, {
      abortEarly: false,
    });

    const checkCategoryId = await db.query(
      `SELECT * FROM categories WHERE id = $1`,
      [gameValidation.categoryId]
    );

    if (checkCategoryId.rows.length === 0) {
      return res.status(400).send("Invalid category ID!");
    }

    res.locals.game = gameValidation;
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }

  next();
}
