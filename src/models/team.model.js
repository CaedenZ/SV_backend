const sql = require("./db.js");

// constructor
const Team = function (team) {
  this.teamScore = team.teamScore;
  this.companyName = team.companyName;
  this.targetUser = team.targetUser;
  this.industry = team.industry;
  this.hotTrend = team.hotTrend;
  this.gID = team.gID;
};

Team.create = (newTeam, result) => {
  sql.query("INSERT INTO teams SET ?", newTeam, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created team: ", { id: res.insertId, ...newTeam });
    result(null, { id: res.insertId, ...newTeam });
  });
};

Team.findById = (teamId, result) => {
  sql.query(`SELECT * FROM teams WHERE id = ${teamId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found team: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Team with the id
    result({ kind: "not_found" }, null);
  });
};

Team.findByGid = (gId, result) => {
  sql.query(`SELECT * FROM teams WHERE gid = ${gId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Team with the id
    result({ kind: "not_found" }, null);
  });
};

Team.getAll = (result) => {
  sql.query("SELECT * FROM teams", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("teams: ", res);
    result(null, res);
  });
};

Team.updateById = (id, team, result) => {
  sql.query(`SELECT * FROM teams WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    sql.query(
      "UPDATE teams SET teamScore = ?, companyName = ?, targetUser = ?, industry = ?, hotTrend = ? WHERE id = ?",
      [
        team.teamScore ? team.teamScore : res[0].teamScore,
        team.companyName ? team.companyName : res[0].companyName,
        team.targetUser ? team.targetUser : res[0].targetUser,
        team.industry ? team.industry : res[0].industry,
        team.hotTrend ? team.hotTrend : res[0].hotTrend,
        id,
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Team with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated team: ", { id: id, ...team });
        result(null, { id: id, ...team });
      }
    );
  });
};

Team.remove = (id, result) => {
  sql.query("DELETE FROM teams WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Team with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted team with id: ", id);
    result(null, res);
  });
};

Team.removeAll = (result) => {
  sql.query("DELETE FROM teams", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} teams`);
    result(null, res);
  });
};

module.exports = Team;
