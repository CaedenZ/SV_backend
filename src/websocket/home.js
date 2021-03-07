const WebSocket = require("ws");

getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

module.exports = (wss) => {
  var clients = [];

  wss.on("connection", function connection(ws) {
    ws.id = getUniqueID();
    ws.on("message", function incoming(data) {
      console.log(wss.clients.size);
      received = JSON.parse(data);
      console.log(received);
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
  });
};
