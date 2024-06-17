const QuestionnaireHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "questionnaire",
  version: "1.0.0",
  register: async (server, { service, validator, categoriesService }) => {
    const questionnaireHandler = new QuestionnaireHandler(
      service,
      validator,
      categoriesService
    );
    server.route(routes(questionnaireHandler));
  },
};
