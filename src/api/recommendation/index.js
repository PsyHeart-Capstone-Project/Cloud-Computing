const RecommendationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "recommendation",
  version: "1.0.0",
  register: async (server, { service, questionnaireService }) => {
    const recommendationHandler = new RecommendationHandler(
      service,
      questionnaireService
    );
    server.route(routes(recommendationHandler));
  },
};
