const sql = require("./db.js");

// constructor
class Game {
  constructor(game) {
    this.date = game.date;
    this.status = game.status;
    this.team = [];
  }

  newTeam = (team) => {
    this.team.push(team);
  };

  create = (result) => {
    sql.query("INSERT INTO games SET ?", this.game, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created game: ", { id: res.insertId, ...this.game });
      result(null, { id: res.insertId, ...this.game });
    });
  };

  getCompanyCard = (result) => {
    sql.query();
  };

  getIndustryCard = (result) => {
    sql.query();
  };

  getTargetUserCard = (result) => {
    sql.query();
  };

  getHotTrendCard = (result) => {
    sql.query();
  };
}

module.exports = Game;
