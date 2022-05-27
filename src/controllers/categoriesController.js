import db from "../db.js";

export async function addCategory(req, res) {
  try {
    const { category } = res.locals;
    const checkCategory = await db.query(
      `SELECT * FROM categories WHERE name = $1`,
      [category.name]
    );

    if (checkCategory.rows.length > 0) {
      return res.sendStatus(409);
    }

    await db.query(`INSERT INTO categories (name) VALUES ($1)`, [
      category.name,
    ]);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await db.query(`SELECT * FROM categories`);
    res.status(200).send(categories.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
