const Team = require("../models/team.model.js");
// Create and Save a new Team
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Team
  const team = new Team({
    teamScore: req.body.teamScore,
    companyName: req.body.companyName,
    targetUser: req.body.targetUser,
    industry: req.body.industry,
    hotTrend: req.body.hotTrend,
    gID: req.body.gID,
  });

  // Save Team in the database
  Team.create(team, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Team.",
      });
    else res.send(data);
  });
};

// Retrieve all Teams from the database.
exports.findAll = (req, res) => {
  console.log(req.session);
  Team.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving teams.",
      });
    else res.send(data);
  });
};

// Find a single Team with a teamId
exports.findByID = (req, res) => {
  Team.findById(req.params.teamId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.teamId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Team with id " + req.params.teamId,
        });
      }
    } else res.send(data);
  });
};

// Find a single Team with a teamId
exports.findByGID = (req, res) => {
  Team.findByGid(req.params.gID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with gid ${req.params.gID}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Team with gid " + req.params.gID,
        });
      }
    } else res.send(data);
  });
};

// Update a Team identified by the teamId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Team.updateById(req.params.teamId, new Team(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.teamId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Team with id " + req.params.teamId,
        });
      }
    } else res.send(data);
  });
};

// Delete a Team with the specified teamId in the request
exports.delete = (req, res) => {
  Team.remove(req.params.teamId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Team with id ${req.params.teamId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Team with id " + req.params.teamId,
        });
      }
    } else res.send({ message: `Team was deleted successfully!` });
  });
};

// Delete all Teams from the database.
exports.deleteAll = (req, res) => {
  Team.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all teams.",
      });
    else res.send({ message: `All Teams were deleted successfully!` });
  });
};
