/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class QuestionnaireHandler {
  constructor(service, validator, categoriesService) {
    this._service = service;
    this._validator = validator;
    this._categoriesService = categoriesService;
    this._errorCheck = ErrorChecker;

    this.getQuestionsHandler = this.getQuestionsHandler.bind(this);
    this.postQuestionnaireAnswerHandler =
      this.postQuestionnaireAnswerHandler.bind(this);
    this.putQuestionnaireAnswerHandler =
      this.putQuestionnaireAnswerHandler.bind(this);
  }

  async getQuestionsHandler(request, h) {
    try {
      request.auth;
      const questions = await this._service.getQuestions();

      const response = h.response({
        status: "success",
        message: "Questionnaire retrieved successfully",
        data: {
          questions,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async postQuestionnaireAnswerHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      this._validator.validateQuestionnaireAnswersPayload(request.payload);
      const { answers } = request.payload;

      const answer = await this._service.addAnswers(id, answers);

      const response = h.response({
        status: "success",
        message: "Questionnaire submitted successfully",
        data: {
          mood: answer.mood,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async putQuestionnaireAnswerHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      this._validator.validateQuestionnaireAnswersPayload(request.payload);
      const { answers } = request.payload;

      const { mood } = await this._service.updateAnswers(id, answers);
      const category = (await this._categoriesService.getCategories()).find(
        (category) => category.name === mood
      );

      const response = h.response({
        status: "success",
        message: "Questionnaire updated successfully",
        data: {
          mood,
          description: category ? category.description : null,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = QuestionnaireHandler;
