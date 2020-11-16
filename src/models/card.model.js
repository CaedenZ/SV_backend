const sql = require("./db.js");

// constructor
const Card = function (card) {
  this.type = card.type;
  this.name = card.name;
};

Card.create = (newCard, result) => {
  sql.query("INSERT INTO cards SET ?", newCard, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created card: ", { id: res.insertId, ...newCard });
    result(null, { id: res.insertId, ...newCard });
  });
};

Card.findById = (cardId, result) => {
  sql.query(`SELECT * FROM cards WHERE id = ${cardId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found card: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Card with the id
    result({ kind: "not_found" }, null);
  });
};

Card.findByType = (type, result) => {
  sql.query(`SELECT * FROM cards WHERE type = \"${type}\"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    // not found Card with the id
    result({ kind: "not_found" }, null);
  });
};

Card.getRandomCard = (teamNumber, type, result) => {
  sql.query(
    `SELECT * FROM cards WHERE type = \"${type}\" ORDER BY RAND() LIMIT ${teamNumber}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found Card with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Card.getAll = (result) => {
  sql.query("SELECT * FROM cards", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("cards: ", res);
    result(null, res);
  });
};

Card.updateById = (id, card, result) => {
  sql.query(`SELECT * FROM cards WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    sql.query(
      "UPDATE cards SET type = ?, name = ? WHERE id = ?",
      [
        card.type ? card.type : res[0].type,
        card.name ? card.name : res[0].name,
        id,
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Card with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated card: ", { id: id, ...card });
        result(null, { id: id, ...card });
      }
    );
  });
};

Card.remove = (id, result) => {
  sql.query("DELETE FROM cards WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Card with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted card with id: ", id);
    result(null, res);
  });
};

Card.removeAll = (result) => {
  sql.query("DELETE FROM cards", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} cards`);
    result(null, res);
  });
};

module.exports = Card;
