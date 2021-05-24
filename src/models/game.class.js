const util = require("util");
const conn = require("./db.js");
const sql = util.promisify(conn.query).bind(conn);
// constructor
class Game {
  constructor(teams) {
    this.date = new Date();
    this.status = "End";
    this.teams = teams;
  }

  create() {
    console.log(this);
    let data = {
      date: this.date,
      status: this.status,
    };
    sql("INSERT INTO games SET ?", data, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("created game: ", { id: res.insertId, ...this.game });
      await this.updateTeam(res.insertId);
    });
  }

  async updateTeam(gid) {
    for (var key in this.teams) {
      let data = {
        teamScore: this.teams[key].score,
        companyName: this.teams[key].companyName,
        targetUser: this.teams[key].targetUser,
        industry: this.teams[key].industry,
        hotTrend: this.teams[key].hotTrend,
        gID: gid,
      };
      try {
        const res = await sql("INSERT INTO teams SET ?", data);
        console.log("created team: ", { id: res.insertId, ...data });
        console.log(this.teams);
        console.log(key);
        this.teams[key].members.forEach((member) => {
          console.log(member);
          this.updateMember(member, res.insertId, this.teams[key].score);
        });
      } catch (err) {
        console.log("error: ", err);
        return;
      }
    }
  }

  async updateMember(name, tid, score) {
    try {
      var res = await sql(
        `SELECT id, score FROM users WHERE name = \"${name}\"`
      );
      if (res.length) {
        console.log("found user: ", res[0]);
        let foundUser = res[0];
        let data = {
          tid,
          uid: foundUser.id,
        };
        res = await sql("INSERT INTO team_user SET ?", data);
        let user = {
          score: score + foundUser.score,
        };
        this.updateScore(foundUser.id, user);
      }
    } catch (err) {
      console.log("error: ", err);
      return;
    }
  }

  async updateScore(id, user) {
    try {
      var res = await sql(`SELECT * FROM users WHERE id = ${id}`);
      var res = await sql(
        "UPDATE users SET email = ?, name = ?, password=?, score = ?, type = ?, refreshtoken = ? WHERE id = ?",
        [
          user.email ? user.email : res[0].email,
          user.name ? user.name : res[0].name,
          user.password ? user.password : res[0].password,
          user.score ? user.score : res[0].score,
          user.type ? user.type : res[0].type,
          user.refreshtoken ? user.refreshtoken : res[0].refreshtoken,
          id,
        ]
      );

      if (res.affectedRows == 0) {
        // not found User with the id
        return;
      }

      console.log("updated user: ", { id: id, ...user });
    } catch (err) {
      console.log("error: ", err);
      return;
    }
  }
}

module.exports = Game;
