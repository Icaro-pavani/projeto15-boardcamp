import { stripHtml } from "string-strip-html";

import customersSchema from "../schemas/customersSchema.js";

export default async function validCustomerBody(req, res, next) {
  try {
    const { name, phone, cpf, birthday } = req.body;
    const customerBody = {
      name: stripHtml(name).result.trim(),
      phone: stripHtml(phone).result.trim(),
      cpf: stripHtml(cpf).result.trim(),
      birthday: stripHtml(birthday).result.trim(),
    };
    const customerValidation = await customersSchema.validateAsync(customerBody, {
      abortEarly: false,
    });

    res.locals.customer = customerValidation;
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }

  next();
}
