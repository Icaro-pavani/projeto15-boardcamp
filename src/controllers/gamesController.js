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

export async function getGames(req, res) {
  try {
    const searchString = req.query.name;
    const limit = req.query.limit || null;
    const offset = req.query.offset || 0;
    const { order, desc } = req.query;

    let games = [];

    if (!searchString) {
      games = await db.query(
        `
        SELECT games.*, categories.name as "categoryName", COUNT(rentals."gameId")::int as "rentalsCount"
        FROM games JOIN categories 
        ON games."categoryId"=categories.id
        LEFT JOIN rentals ON games.id = rentals."gameId"
        GROUP BY games.id, categories.name
        ORDER BY ${
          order
            ? `"${order.replace(/delete/gi, "").replace(/update/gi, "")}"`
            : "id"
        }
        ${desc === "true" ? "DESC" : ""}
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      );
    } else {
      games = await db.query(
        `
          SELECT games.*, categories.name as "categoryName", COUNT(rentals."gameId")::int as "rentalsCount"
          FROM games JOIN categories 
          ON games."categoryId"=categories.id
          LEFT JOIN rentals ON games.id = rentals."gameId"
          WHERE LOWER(games.name) LIKE $3||'%'
          GROUP BY games.id, categories.name
          ORDER BY ${
            order
              ? `"${order.replace(/delete/gi, "").replace(/update/gi, "")}"`
              : "id"
          }
          ${desc === "true" ? "DESC" : ""}
          LIMIT $1 OFFSET $2
      `,
        [limit, offset, searchString.toLowerCase()]
      );
    }

    res.status(200).send(games.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
