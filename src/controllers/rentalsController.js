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
    const { customerId, gameId, startDate, status } = req.query;
    const limit = req.query.limit || null;
    const offset = req.query.offset || 0;
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
      let textQuery = `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) as costumer, 
      json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) as game
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId"=categories.id
      `;

      if (status === "open") {
        textQuery += `WHERE rentals."returnDate" IS NULL`;
      } else if (status === "close") {
        textQuery += `WHERE rentals."returnDate" IS NOT NULL`;
      }

      if (startDate) {
        textQuery += `WHERE rentals."rentDate" >= $3`;
      }

      textQuery += " LIMIT $1 OFFSET $2";

      if (startDate) {
        rentalsResult = await db.query(textQuery, [limit, offset, startDate]);
      } else {
        rentalsResult = await db.query(textQuery, [limit, offset]);
      }
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
  try {
    const { id } = req.params;
    const returnDate = dayjs().format("YYYY-MM-DD");

    let delayFee;

    const rentalResult = await db.query(
      `
      SELECT rentals.*, games."pricePerDay" FROM rentals 
      JOIN games ON rentals."gameId" = games.id
      WHERE rentals.id = $1
    `,
      [parseInt(id)]
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
      [returnDate, delayFee, parseInt(id)]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    rentDate.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  try {
    const { id } = req.params;
    const rentalResult = await db.query(
      `
      SELECT * FROM rentals WHERE id = $1
    `,
      [parseInt(id)]
    );

    if (rentalResult.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (rentalResult.rows[0].returnDate !== null) {
      return res.status(400).send("Returned rental!");
    }

    await db.query(
      `
      DELETE FROM rentals WHERE id = $1
    `,
      [parseInt(id)]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getRentalMetrics(req, res) {
  try {
    const { startDate, endDate } = req.query;
    let queryMetricString = `
      SELECT SUM("originalPrice")::int as "priceSum", SUM("delayFee")::int as "feeSum", COUNT(id)::int
      FROM rentals
    `;
    let metricResult;

    if (startDate && endDate) {
      queryMetricString += ` WHERE "rentDate" >= $1 AND "rentDate" <= $2`;
      metricResult = await db.query(queryMetricString, [startDate, endDate]);
    } else if (startDate || endDate) {
      if (startDate) {
        queryMetricString += ` WHERE "rentDate" >= $1`;
        metricResult = await db.query(queryMetricString, [dayjs(startDate)]);
      } else {
        queryMetricString += ` WHERE "rentDate" <= $1`;
        metricResult = await db.query(queryMetricString, [endDate]);
      }
    } else {
      metricResult = await db.query(queryMetricString);
    }

    const { priceSum, feeSum, count: rentals } = metricResult.rows[0];
    const revenue = priceSum + feeSum;
    const average = parseInt(revenue / rentals);

    const metrics = {
      revenue,
      rentals,
      average,
    };

    res.status(200).send(metrics);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
