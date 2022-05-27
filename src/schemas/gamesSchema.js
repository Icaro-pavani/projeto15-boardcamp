import Joi from "joi";

const gamesSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().allow(null, ""),
  stockTotal: Joi.number().integer().greater(0).required(),
  categoryId: Joi.number().integer().greater(0).required(),
  pricePerDay: Joi.number().integer().greater(0).required(),
});

export default gamesSchema;
