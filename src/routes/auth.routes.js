module.exports = (server) => {
  const auth = require("../controllers/auth.controller.js");

  // Create a new Customer
  server.post("/register", auth.register);

  // Retrieve all Customers
  server.post("/login", auth.login);

  // Retrieve a single Customer with userId
  server.post("/logout", auth.logout);

  // Update a Customer with userId
  server.post("/protected", auth.protected);

  // Delete a Customer with userId
  server.post("/refresh_token", auth.refreshToken);
};
