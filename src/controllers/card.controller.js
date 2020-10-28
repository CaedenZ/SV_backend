const Card = require("../models/card.model.js");
// Create and Save a new Card
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Card
  const card = new Card({
    type: req.body.type,
    name: req.body.name,
  });

  // Save Card in the database
  Card.create(card, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Card.",
      });
    else res.send(data);
  });
};

// Retrieve all Cards from the database.
exports.findAll = (req, res) => {
  Card.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving cards.",
      });
    else res.send(data);
  });
};

// Find a single Card with a cardId
exports.findByID = (req, res) => {
  Card.findById(req.params.cardId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Card with id ${req.params.cardId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Card with id " + req.params.cardId,
        });
      }
    } else res.send(data);
  });
};

// Find a single Card with a type
exports.findByType = (req, res) => {
  Card.findByType(req.params.type, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Card with type ${req.params.type}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Card with type " + req.params.type,
        });
      }
    } else res.send(data);
  });
};

// Update a Card identified by the cardId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Card.updateById(req.params.cardId, new Card(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Card with id ${req.params.cardId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Card with id " + req.params.cardId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Card with the specified cardId in the request
exports.delete = (req, res) => {
  Card.remove(req.params.cardId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Card with id ${req.params.cardId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Card with id " + req.params.cardId,
        });
      }
    } else res.send({ message: `Card was deleted successfully!` });
  });
};

// Delete all Cards from the database.
exports.deleteAll = (req, res) => {
  Card.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all cards.",
      });
    else res.send({ message: `All Cards were deleted successfully!` });
  });
};
