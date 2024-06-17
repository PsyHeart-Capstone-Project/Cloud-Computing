const Joi = require("joi");

const emailLowercase = Joi.string()
  .email()
  .required()
  .custom((value) => {
    return value.toLowerCase();
  });

const passwordSchema = Joi.string()
  .min(6)
  .pattern(/^[A-Z]/, "first letter uppercase")
  .pattern(/[!@#\$%\^&\*\.]/, "one symbol")
  .required();

const PostAuthenticationPayloadSchema = Joi.object({
  email: emailLowercase,
  password: passwordSchema,
});

module.exports = {
  PostAuthenticationPayloadSchema,
};
