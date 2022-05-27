import { stripHtml } from "string-strip-html";

import categoriesSchema from "../schemas/categoriesSchema.js";

export default async function validCategoryBody(req, res, next) {
  try {
    const categoryBody = {
      name: stripHtml(req.body.name).result.trim(),
    };
    const categoryValidation = await categoriesSchema.validateAsync(
      categoryBody
    );
    res.locals.category = categoryValidation;
  } catch (error) {
    return res.status(400).send(error.message);
  }

  next();
}
