import dayjs from "dayjs";

import db from "../db.js";
import rentalSchema from "../schemas/rentalSchema.js";

export default async function validRentalBody(req, res, next) {
  try {
    const { customerId, gameId, daysRented } = req.body;
    const rentalBodyValidation = await rentalSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    const customerResult = await db.query(
      `
        SELECT * FROM customers WHERE id=$1
    `,
      [customerId]
    );
    if (customerResult.rows.length === 0) {
      return res.status(400).send("There is no customer with this ID");
    }

    const gameResult = await db.query(
      `
          SELECT * FROM games WHERE id=$1
      `,
      [gameId]
    );
    if (gameResult.rows.length === 0) {
      return res.status(400).send("There is no game with this ID");
    }

    const gamesRented = await db.query(
      `
        SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" = $2
    `,
      [gameId, null]
    );
    if (gamesRented.rows.length >= gameResult.rows[0].stockTotal) {
      return res
        .status(400)
        .send("There are no more units of this game to rent!");
    }

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * gameResult.rows[0].pricePerDay;

    res.locals.rental = {
      ...rentalBodyValidation,
      rentDate,
      originalPrice,
      returnDate: null,
      delayFee: null,
    };
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }

  next();
}
