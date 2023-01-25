module.exports = function (app) {
  app.use("/signup", require("./signUp"));
  app.use("/signin", require("./signIn"));
  app.use("/fetch", require("./fetch"));
  app.use("/status", require("./status"));
  app.use("/not_found", require("./404"));
  app.use("/", require("./cats"));
};
