module.exports = (app) => {
  const games = require("../controllers/game.controller.js");

  // Create a new Customer
  app.post("/games", games.create);

  // Retrieve all Customers
  app.get("/games", games.findAll);

  // Retrieve a single Customer with gameId
  app.get("/games/:gameId", games.findByID);

  // Update a Customer with gameId
  app.put("/games/:gameId", games.update);

  // Delete a Customer with gameId
  app.delete("/games/:gameId", games.delete);

  // Create a new Customer
  app.delete("/games", games.deleteAll);
};
