module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  // Create a new User
  app.post("/users", users.create);

  // Retrieve all Users
  app.get("/users", users.findAll);

  // Retrieve Top 20 Users
  app.get("/userstop20", users.findTop20);

  // Retrieve a single User with userId
  app.get("/users/:userId", users.findByID);

  // Update a User with userId
  app.put("/users/:userId", users.update);

  // Delete a User with userId
  app.delete("/users/:userId", users.delete);

  // Create a new User
  app.delete("/users", users.deleteAll);
};
