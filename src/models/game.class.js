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

  create = () => {
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
}

module.exports = Game;
