const routes = (handler) => [
  {
    method: "POST",
    path: "/register",
    handler: handler.postUserHandler,
  },
  {
    method: "GET",
    path: "/profiles",
    handler: handler.getUserProfileHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
  {
    method: "PUT",
    path: "/profiles",
    handler: handler.putProfileUserHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
];

module.exports = routes;
