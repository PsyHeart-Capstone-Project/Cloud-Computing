const routes = (handler) => [
  {
    method: "POST",
    path: "/login",
    handler: handler.postAuthenticationHandler,
  },
  {
    method: "POST",
    path: "/logout",
    handler: handler.deleteAuthenticationHandler,
    options: {
      auth: "psyheartapp_jwt",
    },
  },
];

module.exports = routes;
