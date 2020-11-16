const WebSocket = require("ws");
const Card = require("../models/card.model");

let map = new Map();
let team = {};
let cards = {};

getCards = () => {
  var size = Object.keys(team).length;
  Card.getRandomCard(size * 2, "Company Name", (err, data) => {
    if (err) console.log(err);
    else {
      chunkArray(data, size, cards, "card");
      Card.getRandomCard(size * 2, "Target User", (err, data) => {
        if (err) console.log(err);
        else {
          chunkArray(data, size, cards, "card");
          Card.getRandomCard(size * 2, "Industry", (err, data) => {
            if (err) console.log(err);
            else {
              chunkArray(data, size, cards, "card");
              Card.getRandomCard(size, "Hot Trend", (err, data) => {
                if (err) console.log(err);
                else {
                  chunkArray(data, size, cards, "card");
                  console.log(cards);
                  for (var key in team) {
                    team[key].members.forEach((member) => {
                      data = cards[key];
                      ret = {
                        type: "card",
                        data: data,
                      };
                      console.log(map.get(member));
                      map.get(member).send(JSON.stringify(ret));
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });
};
getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

assignTeams = (teamNumber) => {
  let array = [...map.keys()];
  shuffle(array);
  tmp = {};
  for (var i = 0; i < teamNumber; i++) {
    tmp[i] = {
      members: [],
      cards: { companyName: "", targetUser: "", industry: "", hotTrend: "" },
    };
    cards[i] = [];
  }
  chunkArray(array, teamNumber, tmp, "team");
  team = tmp;
  console.log(team);
};

chunkArray = (myArray, chunk_number, res, type) => {
  var arrayLength = myArray.length;

  for (var index = 0; index < arrayLength; index++) {
    // Do something if you want with the group
    console.log(myArray[index]);
    if (type === "team") res[index % chunk_number].members.push(myArray[index]);
    else if (type === "card") res[index % chunk_number].push(myArray[index]);
  }
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = (wss) => {
  wss.on("upgrade", function (request, socket, head) {
    console.log("Parsing session from request...");

    sessionParser(request, {}, () => {
      if (!request.session.userId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      console.log("Session is parsed!");

      wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit("connection", ws, request);
      });
    });
  });

  wss.on("connection", function connection(ws, req) {
    console.log(req.session);
    if (req.session) {
      const userId = req.session.userId;

      map.set(userId, ws);
    }

    ws.on("message", function incoming(data) {
      if (!ws.name) {
        console.log(data);
        ws.name = data;
        map.set(ws.name, ws);
      } else {
        received = JSON.parse(data);
        if (received.type === "message") {
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              msg = {
                user: received.data.user,
                text: received.data.text,
              };
              ret = {
                type: "message",
                data: msg,
              };
              console.log(ret);
              client.send(JSON.stringify(ret));
            }
          });
        } else if (received.type === "team") {
          assignTeams(received.data);
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              ret = {
                type: "team",
                data: team,
              };
              client.send(JSON.stringify(ret));
            }
          });
        } else if (received.type === "start") {
          getCards();
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              ret = {
                type: "start",
              };
              client.send(JSON.stringify(ret));
            }
          });
        } else if (received.type === "card") {
          getCards();
        }
      }
    });

    ws.on("close", function () {
      map.delete(ws.name);
    });
  });
};
