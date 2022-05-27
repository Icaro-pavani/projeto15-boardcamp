import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

const customersSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/),
  cpf: Joi.string().pattern(/^[0-9]{11}$/),
  birthday: Joi.date().format("YYYY-MM-DD"),
});

export default customersSchema;
