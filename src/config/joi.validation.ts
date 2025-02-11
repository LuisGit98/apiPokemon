import * as Joi from 'joi'

//aqui puedo estabecer las validaciones usando esta libreria 
export const joiValidationSchema = Joi.object({
MONGODB:Joi.required(),
PORT:Joi.number().default(3009),
DEFAULT_LIMIT:Joi.number().default(3)
})