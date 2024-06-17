/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      const validatedPayload =
        this._validator.validatePostAuthenticationPayload(request.payload);
      const { email, password } = validatedPayload;

      const id = await this._usersService.verifyUserCredential(email, password);
      await this._authenticationsService.isUserLoggedIn(id);

      const token = this._tokenManager.generateToken({ id });
      await this._authenticationsService.addToken(token);

      const response = h.response({
        status: "success",
        message: "Login successful",
        data: {
          token,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      const { token } = request.auth.artifacts;
      await this._authenticationsService.deleteToken(token);

      const response = h.response({
        status: "success",
        message: "Logout successful",
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = AuthenticationsHandler;
