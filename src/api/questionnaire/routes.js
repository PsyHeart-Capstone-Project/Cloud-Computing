const routes = (handler) => [
  {
    method: "GET",
    path: "/questionnaire",
    handler: handler.getQuestionsHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/questionnaire",
    handler: handler.postQuestionnaireAnswerHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
  {
    method: "PUT",
    path: "/questionnaire",
    handler: handler.putQuestionnaireAnswerHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
];

module.exports = routes;
