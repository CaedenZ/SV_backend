module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  // Create a new Customer
  app.post("/users", users.create);

  // Retrieve all Customers
  app.get("/users", users.findAll);

  // Retrieve a single Customer with userId
  app.get("/users/:userId", users.findByID);

  // Update a Customer with userId
  app.put("/users/:userId", users.update);

  // Delete a Customer with userId
  app.delete("/users/:userId", users.delete);

  // Create a new Customer
  app.delete("/users", users.deleteAll);
};
