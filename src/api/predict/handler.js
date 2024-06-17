/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class PredictHandler {
  constructor(service) {
    this._service = service;
    this._errorCheck = ErrorChecker;

    this.predictCategoryHandler = this.predictCategoryHandler.bind(this);
  }

  async predictCategoryHandler(request, h) {
    try {
      const { input, bpm } = request.payload;
      const result = await this._service.predictCategory(input, bpm);

      const response = h.response({
        status: "success",
        message: "Predict Category Successfully",
        data: {
          result,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = PredictHandler;
