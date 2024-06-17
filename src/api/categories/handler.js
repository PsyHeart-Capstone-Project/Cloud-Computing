/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class CategoriesHandler {
  constructor(service) {
    this._service = service;
    this._errorCheck = ErrorChecker;

    this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    this.getSongCategoriesDetailHandler =
      this.getSongCategoriesDetailHandler.bind(this);
  }

  async getCategoriesHandler(request, h) {
    try {
      request.auth;
      const categories = await this._service.getCategories();

      const response = h.response({
        status: "success",
        message: "Song Categories retrieved successfully",
        data: {
          categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            image_url: category.img_url,
          })),
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getSongCategoriesDetailHandler(request, h) {
    try {
      request.auth;
      const { id } = request.params;

      const categoryDetail = await this._service.getCategoryDetail(id);

      const response = h.response({
        status: "success",
        message: "Song Category Details retrieved successfully",
        data: {
          detail: {
            id: categoryDetail[0]?.c_id,
            name: categoryDetail[0]?.c_name,
            description: categoryDetail[0]?.c_desc,
          },
          songs: categoryDetail.map((song) => ({
            id: song.id,
            name: song.name,
            duration: song.duration,
            url: song.url,
            artist_name: song.artist_name,
          })),
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = CategoriesHandler;
