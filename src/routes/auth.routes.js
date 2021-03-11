module.exports = (server) => {
  const auth = require("../controllers/auth.controller.js");

  server.post("/register", auth.register);

  server.post("/login", auth.login);

  server.post("/logout", auth.logout);

  server.post("/protected", auth.protected);

  server.post("/refresh_token", auth.refreshToken);

  server.post("/forgot", auth.forgot);

  server.post("/reset", auth.reset);
};
