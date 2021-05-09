const sql = require("../models/db.js");

const readline = require("readline");
const fs = require("fs");

const readInterface = readline.createInterface({
  input: fs.createReadStream("src/util/targetuser.txt"),
  output: process.stdout,
  console: false,
});

readInterface.on("line", function (line) {
  newCard = {
    type: "Target User",
    name: line,
  };
  sql.query("INSERT INTO cards SET ?", newCard, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return;
    }

    console.log("created card: ", { id: res.insertId, ...newCard });
  });
  console.log(line);
});
