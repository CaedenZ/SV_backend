require("dotenv/config");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DBname,
});

con.connect(function (err) {
  console.log(process.env.DBhost);
  if (err) console.log(err);
  console.log("Connected!");
});

// const query = (sql) => {
//   con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       return result;
//     });
//   });
// };

// results = query("SELECT * FROM users;");

// query(
//   "INSERT INTO users (email, name, score) VALUES ('Caeden@cc.com', 'Caeden', 0)"
// );

module.exports = con;
