import db from "../db.js";

export async function addCustomer(req, res) {
  try {
    const { customer } = res.locals;
    const { name, phone, cpf, birthday } = customer;

    const checkCPF = await db.query(
      `
      SELECT * FROM customers WHERE cpf=$1
      `,
      [cpf]
    );

    if (checkCPF.rows.length > 0) {
      return res.status(409).send("CPF already exist!");
    }

    await db.query(
      `
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCustomers(req, res) {
  try {
    const cpfQuery = req.query.cpf;
    let customers = [];

    if (!cpfQuery) {
      customers = await db.query(`SELECT * FROM  customers`);
    } else {
      customers = await db.query(
        `SELECT * FROM customers WHERE cpf LIKE $1||'%'`,
        [cpfQuery]
      );
    }

    res.status(200).send(customers.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
