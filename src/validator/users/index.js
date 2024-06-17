const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema, UpdateUserPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error, value } = UserPayloadSchema.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },
  validateUpdateUserPayload: (payload) => {
    const { error, value } = UpdateUserPayloadSchema.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },
};

module.exports = UsersValidator;
