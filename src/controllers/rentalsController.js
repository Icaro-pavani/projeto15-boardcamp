import dayjs from "dayjs";

import db from "../db.js";

export async function addRental(req, res) {
  try {
    const { rental } = res.locals;
    const {
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    } = rental;

    await db.query(
      `
        INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  try {
    const { customerId, gameId } = req.query;
    let rentalsResult;

    if (customerId) {
      rentalsResult = await db.query(
        `
      SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) as costumer, 
      json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) as game
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId"=categories.id
      WHERE rentals."customerId" = $1
    `,
        [parseInt(customerId)]
      );
    } else if (gameId) {
      rentalsResult = await db.query(
        `
      SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) as costumer, 
      json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) as game
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId"=categories.id
      WHERE rentals."gameId" = $1
    `,
        [parseInt(gameId)]
      );
    } else {
      rentalsResult = await db.query(`
      SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) as costumer, 
      json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) as game
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId"=categories.id
    `);
    }

    const rentals = rentalsResult.rows.map((rental) => {
      return {
        ...rental,
        rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
        returnDate:
          rental.returnDate === null
            ? null
            : dayjs(rental.returnDate).format("YYYY-MM-DD"),
      };
    });

    res.status(200).send(rentals);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  const { id } = req.params;
  const returnDate = dayjs().format("YYYY-MM-DD");

  let delayFee;

  const rentalResult = await db.query(
    `
    SELECT rentals.*, games."pricePerDay" FROM rentals 
    JOIN games ON rentals."gameId" = games.id
    WHERE rentals.id = $1
  `,
    [id]
  );

  if (rentalResult.rows.length === 0) {
    return res.sendStatus(404);
  }

  if (rentalResult.rows[0].returnDate !== null) {
    return res.status(400).send("Rental returned already!");
  }

  const { rentDate, daysRented, pricePerDay } = rentalResult.rows[0];
  const daysDelayed = dayjs(returnDate).diff(rentDate, "day") - daysRented;

  if (daysDelayed > 0) {
    delayFee = daysDelayed * pricePerDay;
  } else {
    delayFee = 0;
  }

  await db.query(
    `
    UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 
    WHERE id = $3
  `,
    [returnDate, delayFee, id]
  );

  res.sendStatus(200);
}
