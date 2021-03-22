const { sign } = require("jsonwebtoken");

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (userId) => {
  return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const createResetToken = (userId) => {
  return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const sendResetToken = (res, req, resettoken, name, type) => {
  res.send({
    resettoken,
    email: req.body.email,
    name: name,
    type: type,
  });
};

const sendAccessToken = (res, req, accesstoken, refreshtoken, name, type) => {
  res.send({
    accesstoken,
    refreshtoken,
    email: req.body.email,
    name: name,
    type: type,
  });
};

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createResetToken,
  sendAccessToken,
  sendRefreshToken,
  sendResetToken,
};
