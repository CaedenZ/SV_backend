require("dotenv/config");
const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const server = express();
const wss = new WebSocket.Server({ server });

server.use(cookieparser());
server.use(cors());

server.use(function (req, res, next) {
  res.header("Acce");
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send({ message: "hi" });
});

require("./routes/user.routes.js")(server);
require("./routes/auth.routes.js")(server);

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (clients !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
