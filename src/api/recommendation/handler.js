/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class RecommendationHandler {
  constructor(service, questionnaireService) {
    this._service = service;
    this._questionnaireService = questionnaireService;
    this._errorCheck = ErrorChecker;

    this.getSongRecommendationHandler =
      this.getSongRecommendationHandler.bind(this);
  }

  async getSongRecommendationHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const mood = await this._questionnaireService.getMoodNameById(id);
      const recommendation = await this._service.getSongByMood(mood);

      const response = h.response({
        status: "success",
        message: "Song recommendation retrieved successfully",
        data: {
          mood,
          recommendation,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = RecommendationHandler;
