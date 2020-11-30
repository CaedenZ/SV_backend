const WebSocket = require("ws");
const Card = require("../models/card.model");
const Game = require("../models/game.class");

let map = new Map();
let team = {};
let cards = {};
let voted = [];
let game = new Game();
let usermap = new Map();
let adminmap = new Map();

initGame = () => {
  game = new Game();
};

swapteam = (nameA, nameB) => {
  const keyA = getTeam(nameA);
  const keyB = getTeam(nameB);
  const indexA = team[keyA].members.indexOf(nameA);
  if (indexA > -1) {
    team[keyA].members.splice(indexA, 1);
  }
  const indexB = team[keyB].members.indexOf(nameB);
  if (indexB > -1) {
    team[keyB].members.splice(indexB, 1);
  }
  team[keyA].members.push(nameB);
  team[keyB].members.push(nameA);
};
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
                    team[key].hotTrend = cards[key].find(
                      (e) => e.type === "Hot Trend"
                    ).name;
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

receiveCard = (name, data) => {
  switch (data.type) {
    case "Company Name":
      team[getTeam(name)].companyName = data.name;
      break;
    case "Target User":
      team[getTeam(name)].targetUser = data.name;
      break;
    case "Industry":
      team[getTeam(name)].industry = data.name;
      break;
  }

  team[getTeam(name)].members.forEach((member) => {
    ret = {
      type: "select",
      data: data,
    };
    map.get(member).send(JSON.stringify(ret));
  });
};

getTeam = (name) => {
  return Object.keys(team).find((key) => team[key].members.includes(name));
};

getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

startVote = () => {
  for (var key in team) {
    team[key].members.forEach((member) => {
      var duplicateteam = Object.assign({}, team);
      delete duplicateteam[key];
      data = duplicateteam;
      ret = {
        type: "startvote",
        data: data,
      };
      map.get(member).send(JSON.stringify(ret));
    });
  }
};

vote = (name, data) => {
  if (!voted.includes(name)) {
    team[data.team].score += 1;
    voted.push(name);
  }
  console.log(team);
};

assignTeams = (teamNumber) => {
  let array = [...usermap.keys()];
  shuffle(array);
  tmp = {};
  for (var i = 0; i < teamNumber; i++) {
    tmp[i] = {
      members: [],
      cards: { companyName: "", targetUser: "", industry: "", hotTrend: "" },
      score: 0,
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
    if (req.session) {
      const userId = req.session.userId;

      map.set(userId, ws);
    }

    ws.on("message", function incoming(data) {
      if (!ws.name) {
        ws.name = data;
        map.set(ws.name, ws);
      } else {
        received = JSON.parse(data);
        switch (received.type) {
          case "user":
            ws.name = received.data;
            usermap.set(ws.name, ws);
            break;
          case "admin":
            ws.name = received.data;
            adminmap.set(ws.name, ws);
            break;
          case "message":
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
                client.send(JSON.stringify(ret));
              }
            });
            break;
          case "team":
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
            break;
          case "swap":
            swapteam(received.data.nameA, received.data.nameB);
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                ret = {
                  type: "team",
                  data: team,
                };
                client.send(JSON.stringify(ret));
              }
            });
            break;
          case "start":
            initGame();
            getCards();
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                ret = {
                  type: "start",
                };
                client.send(JSON.stringify(ret));
              }
            });
            break;
          case "card":
            getCards();
            break;
          case "select":
            console.log(received.data);
            receiveCard(ws.name, received.data);
            adminmap.forEach((value, key, map) => {
              ret = {
                type: "teamselecting",
                data: team,
              };
              value.send(JSON.stringify(ret));
            });
            break;
          case "review":
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                ret = {
                  type: "review",
                };
                client.send(JSON.stringify(ret));
              }
            });
            break;
          case "startvote":
            console.log("startvote");
            startVote();
            break;
          case "vote":
            vote(ws.name, received.data);
            break;
          case "result":
            game.setTeam(team);
            game.create();
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                ret = {
                  type: "result",
                  data: team,
                };
                client.send(JSON.stringify(ret));
              }
            });
            team = {};
            cards = {};
            voted = [];
            break;
        }
      }
    });

    ws.on("close", function () {
      map.delete(ws.name);
      usermap.delete(ws.name);
      adminmap.delete(ws.name);
    });
  });
};
