const Joi = require("joi");

// Custom Joi extension to convert email to lowercase
const emailLowercase = Joi.string()
  .email()
  .required()
  .custom((value) => {
    return value.toLowerCase();
  });

// Password validation rules
const passwordSchema = Joi.string()
  .min(6)
  .pattern(/^[A-Z]/, "first letter uppercase")
  .pattern(/[!@#\$%\^&\*\.]/, "one symbol")
  .required();

const UserPayloadSchema = Joi.object({
  email: emailLowercase,
  password: passwordSchema,
  name: Joi.string().required(),
});

const UpdateUserPayloadSchema = Joi.object({
  email: Joi.string()
    .email()
    .custom((value) => {
      return value.toLowerCase();
    }),
  new_password: passwordSchema.optional(),
  name: Joi.string().optional(),
});

module.exports = { UserPayloadSchema, UpdateUserPayloadSchema };
