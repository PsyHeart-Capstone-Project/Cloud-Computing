const PredictHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "predict",
  version: "1.0.0",
  register: async (server, { service }) => {
    const predictHandler = new PredictHandler(service);
    server.route(routes(predictHandler));
  },
};
