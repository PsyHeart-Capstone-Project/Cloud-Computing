const routes = (handler) => [
  {
    method: "POST",
    path: "/predict_category",
    handler: handler.predictCategoryHandler,
  },
];

module.exports = routes;
