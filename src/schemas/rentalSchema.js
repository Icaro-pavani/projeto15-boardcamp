import Joi from "joi";

const rentalSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  daysRented: Joi.number().integer().greater(0).required(),
});

export default rentalSchema;
