const Joi = require("joi");

const answerSchema = Joi.object({
  question_id: Joi.number().integer().required(),
  answer: Joi.string().required(),
});

const QuestionnaireAnswersPayloadSchema = Joi.object({
  answers: Joi.array().items(answerSchema).required(),
});

module.exports = { QuestionnaireAnswersPayloadSchema };
