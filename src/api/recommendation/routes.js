const routes = (handler) => [
  {
    method: "GET",
    path: "/song_recommendation",
    handler: handler.getSongRecommendationHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
];

module.exports = routes;
