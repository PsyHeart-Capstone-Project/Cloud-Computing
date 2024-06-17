const { PostAuthenticationPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error, value } = PostAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
    return value;
  },
};

module.exports = AuthenticationsValidator;
