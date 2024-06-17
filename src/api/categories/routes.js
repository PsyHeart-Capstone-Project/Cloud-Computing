const routes = (handler) => [
  {
    method: "GET",
    path: "/song_categories",
    handler: handler.getCategoriesHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/song_categories/{id}",
    handler: handler.getSongCategoriesDetailHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
];

module.exports = routes;
