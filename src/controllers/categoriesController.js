import db from "../db.js";

export async function addCategory(req, res) {
  try {
    const { category } = res.locals;
    const checkCategory = await db.query(
      `SELECT * FROM categories WHERE name = $1`,
      [category]
    );

    if (!checkCategory) {
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
