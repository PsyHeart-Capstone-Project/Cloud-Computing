const InvariantError = require("../../exceptions/InvariantError");
const { QuestionnaireAnswersPayloadSchema } = require("./schema");

const QuestionnaireValidator = {
  validateQuestionnaireAnswersPayload: (payload) => {
    const validationResult =
      QuestionnaireAnswersPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = QuestionnaireValidator;
