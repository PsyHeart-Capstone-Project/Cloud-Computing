/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require("../../exceptions/ClientError");
const ErrorChecker = require("../../utils/ErrorChecker");

class UsersHandler {
  constructor(service, validator, auth, tokenManager) {
    this._tokenManager = tokenManager;
    this._service = service;
    this._auth = auth;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserProfileHandler = this.getUserProfileHandler.bind(this);
    this.putProfileUserHandler = this.putProfileUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      const validatedPayload = this._validator.validateUserPayload(
        request.payload
      );

      const { email, password, name } = validatedPayload;
      const userId = await this._service.addUser({
        email,
        password,
        name,
      });

      const token = this._tokenManager.generateToken({ id: userId });
      await this._auth.addToken(token);

      const response = h.response({
        status: "success",
        message: "Registration successful",
        data: {
          user_id: userId,
          token,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getUserProfileHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const user = await this._service.getUserById(id);

      const response = h.response({
        status: "success",
        message: "Profile retrieved successfully",
        data: {
          user_id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async putProfileUserHandler(request, h) {
    try {
      const { id } = request.auth.credentials;

      const validatedPayload = this._validator.validateUpdateUserPayload(
        request.payload
      );
      const { email, new_password, name } = validatedPayload;

      const user = await this._service.updateProfileUser({
        id,
        email,
        new_password,
        name,
      });

      const response = h.response({
        status: "success",
        message: "Profile updated successfully",
        data: {
          user_id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = UsersHandler;
