const sql = require("./db.js");
// constructor
class Game {
  constructor() {
    this.date = new Date();
    this.status = "End";
    this.teams = {};
  }

  setTeam(teams) {
    this.teams = teams;
  }

  create() {
    console.log(this);
    let data = {
      date: this.date,
      status: this.status,
    };
    sql.query("INSERT INTO games SET ?", data, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created game: ", { id: res.insertId, ...this.game });
      this.updateTeam(res.insertId);
    });
  }

  updateTeam(gid) {
    for (var key in this.teams) {
      let data = {
        teamScore: this.teams[key].score,
        companyName: this.teams[key].companyName,
        targetUser: this.teams[key].targetUser,
        industry: this.teams[key].industry,
        hotTrend: this.teams[key].hotTrend,
        gID: gid,
      };
      sql.query("INSERT INTO teams SET ?", data, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return;
        }

        console.log("created team: ", { id: res.insertId, ...data });
        this.teams[key].members.forEach((member) => {
          this.updateMember(member, res.insertId, this.teams[key].score);
        });
      });
    }
  }

  async updateMember(name, tid, score) {
    sql.query(
      `SELECT id, score FROM users WHERE name = \"${name}\"`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return;
        }

        if (res.length) {
          console.log("found user: ", res[0]);
          let foundUser = res[0];
          let data = {
            tid,
            uid: foundUser.id,
          };
          sql.query("INSERT INTO team_user SET ?", data, (err, res) => {
            if (err) {
              console.log("error: ", err);
              return;
            }

            let user = {
              score: score + foundUser.score,
            };
            this.updateScore(foundUser.id, user);
          });
        }
      }
    );
  }

  updateScore(id, user) {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return;
      }

      sql.query(
        "UPDATE users SET email = ?, name = ?, password=?, score = ?, type = ?, refreshtoken = ? WHERE id = ?",
        [
          user.email ? user.email : res[0].email,
          user.name ? user.name : res[0].name,
          user.password ? user.password : res[0].password,
          user.score ? user.score : res[0].score,
          user.type ? user.type : res[0].type,
          user.refreshtoken ? user.refreshtoken : res[0].refreshtoken,
          id,
        ],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            return;
          }

          if (res.affectedRows == 0) {
            // not found User with the id
            return;
          }

          console.log("updated user: ", { id: id, ...user });
        }
      );
    });
  }
}

module.exports = Game;
