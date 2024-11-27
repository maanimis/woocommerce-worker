import { FromCsv } from "@/constants";
import Joi from "joi";

export const ProductValidator = Joi.object({
  [FromCsv.varID]: Joi.string().required(),

  [FromCsv.parentID]: Joi.string().required(),

  [FromCsv.type]: Joi.array().items(Joi.string().not("")).required(),
  // .valid(["variation"])

  [FromCsv.regularPrice]: Joi.string().required(),
}).unknown(true);
