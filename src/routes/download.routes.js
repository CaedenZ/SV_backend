module.exports = (server) => {
  const download = require("../controllers/download.controller.js");

  server.get("/download", download.download);
};
