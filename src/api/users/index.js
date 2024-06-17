const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { service, validator, auth, tokenManager }) => {
    const usersHandler = new UsersHandler(
      service,
      validator,
      auth,
      tokenManager
    );
    server.route(routes(usersHandler));
  },
};
