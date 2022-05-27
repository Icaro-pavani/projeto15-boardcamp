import categoriesSchema from "../schemas/categoriesSchema.js";
import { stripHtml } from "string-strip-html";

export default async function validCategoryBody(req, res, next) {
  const categoryBody = {
    name: stripHtml(req.body.name).result.trim(),
  };

  try {
    const categoryValidation = await categoriesSchema.validateAsync(
      categoryBody
    );
    res.locals.category = categoryValidation;
  } catch (error) {
    return res.status(400).send(error.message);
  }

  next();
}
