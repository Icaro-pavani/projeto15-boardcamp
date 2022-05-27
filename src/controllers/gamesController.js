import db from "../db.js";

export async function addGame(req, res) {
  try {
    const { game } = res.locals;
    const { name, image, stockTotal, categoryId, pricePerDay } = game;

    const checkGameName = await db.query(
      `SELECT * FROM games WHERE name = $1`,
      [game.name]
    );

    console.log(checkGameName.rows);

    if (checkGameName.rows.length !== 0) {
      return res.status(409).send("A game with this name already exist!");
    }

    await db.query(
      `
    INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
    VALUES ($1, $2, $3, $4, $5)
    `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
