import dayjs from "dayjs";

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
    const limit = req.query.limit || null;
    const offset = req.query.offset || 0;
    let customers = [];

    if (!cpfQuery) {
      customers = await db.query(
        `SELECT customers.*, COUNT(rentals."customerId")::int as "rentalsCount" 
        FROM customers 
        LEFT JOIN rentals ON rentals."customerId" = customers.id
        GROUP BY customers.id
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      );
    } else {
      customers = await db.query(
        `SELECT customers.*, COUNT(rentals."customerId")::int as "rentalsCount" 
        FROM customers 
        LEFT JOIN rentals ON rentals."customerId" = customers.id
        WHERE cpf LIKE $1||'%'
        GROUP BY customers.id
        `,
        [cpfQuery]
      );
    }

    const customersUpdate = customers.rows.map((customer) => ({
      ...customer,
      birthday: dayjs(customer.birthday).format("YYYY-MM-DD"),
    }));

    res.status(200).send(customersUpdate);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = await db.query(
      `
    SELECT * FROM customers
    WHERE id=$1
    `,
      [parseInt(id)]
    );

    if (customer.rows.length === 0) {
      return res.sendStatus(404);
    }

    res.status(200).send({
      ...customer.rows[0],
      birthday: dayjs(customer.rows[0].birthday).format("YYYY-MM-DD"),
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { customer } = res.locals;
    const { name, phone, cpf, birthday } = customer;

    const getCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [
      parseInt(id),
    ]);

    if (cpf !== getCustomer.rows[0].cpf) {
      const checkCPF = await db.query(
        `
        SELECT * FROM customers WHERE cpf=$1
        `,
        [cpf]
      );

      if (checkCPF.rows.length > 0) {
        return res.status(409).send("CPF already exist!");
      }
    }

    await db.query(
      `
        UPDATE customers 
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5
    `,
      [name, phone, cpf, birthday, parseInt(id)]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
