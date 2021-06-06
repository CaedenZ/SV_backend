require("dotenv/config");
const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
const WebSocket = require("ws");
const session = require("express-session");
const fs = require("fs");

var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
var certificate = fs.readFileSync("sslcert/server.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };

const app = express();

const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});

app.use(sessionParser);
app.use(cookieparser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "hi" });
});
const server = https.createServer(credentials, app);
const wss = new WebSocket.Server({ server });

require("./routes/user.routes.js")(app);
require("./routes/auth.routes.js")(app);
require("./routes/card.routes.js")(app);
require("./routes/game.routes.js")(app);
require("./routes/team.routes.js")(app);
require("./routes/download.routes.js")(app);

require("./websocket/home.js")(wss);

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
