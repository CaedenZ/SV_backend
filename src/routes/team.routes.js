module.exports = (app) => {
  const cards = require("../controllers/card.controller.js");

  // Create a new Customer
  app.post("/cards", cards.create);

  // Retrieve all Customers
  app.get("/cards", cards.findAll);

  // Retrieve a single Customer with cardId
  app.get("/cards/:cardId", cards.findByID);

  // Update a Customer with cardId
  app.put("/cards/:cardId", cards.update);

  // Delete a Customer with cardId
  app.delete("/cards/:cardId", cards.delete);

  // Create a new Customer
  app.delete("/cards", cards.deleteAll);
};
