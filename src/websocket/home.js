const WebSocket = require("ws");

const map = new Map();

getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

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
      console.log(request.session);
      received = JSON.parse(data);
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          msg = {
            user: received.user,
            text: received.text,
          };
          client.send(JSON.stringify(msg));
        }
      });
    });

    ws.on("close", function () {
      //   map.delete(userId);
    });
  });
};
