module.exports = (app) => {
  const teams = require("../controllers/team.controller.js");

  // Create a new Customer
  app.post("/teams", teams.create);

  // Retrieve all Customers
  app.get("/teams", teams.findAll);

  // Retrieve a single Customer with teamId
  app.get("/teams/:gID", teams.findByGID);

  // Update a Customer with teamId
  app.put("/teams/:teamId", teams.update);

  // Delete a Customer with teamId
  app.delete("/teams/:teamId", teams.delete);

  // Create a new Customer
  app.delete("/teams", teams.deleteAll);
};
