require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// Users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// Authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// Categories
const categories = require("./api/categories");
const CategoriesService = require("./services/postgres/CategoriesService");

// Predict
const predict = require("./api/predict");
const PredictService = require("./services/function/PredictService");

// Questionnaire
const questionnaire = require("./api/questionnaire");
const QuestionnaireService = require("./services/postgres/QuestionnaireService");
const QuestionnaireValidator = require("./validator/questionnaire");

// Recommendation
const recommendation = require("./api/recommendation");
const RecommendationService = require("./services/postgres/RecommendationService");

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const categoriesService = new CategoriesService();
  const questionnaireService = new QuestionnaireService();
  const recommendationService = new RecommendationService();
  const predictService = new PredictService();

  //load model
  await predictService.init();

  const server = new Hapi.Server({
    port: 9000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Register external plugins
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Define JWT authentication strategy
  server.auth.strategy("psyheartapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: async (artifacts) => {
      const { token } = artifacts;
      await authenticationsService.verifyToken(token);
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      };
    },
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
        auth: authenticationsService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: categories,
      options: {
        service: categoriesService,
      },
    },
    {
      plugin: predict,
      options: {
        service: predictService,
      },
    },
    {
      plugin: questionnaire,
      options: {
        service: questionnaireService,
        validator: QuestionnaireValidator,
        categoriesService,
      },
    },
    {
      plugin: recommendation,
      options: {
        service: recommendationService,
        questionnaireService,
      },
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
