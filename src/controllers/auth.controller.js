const User = require("../models/user.model.js");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../token.js");
const { isAuth } = require("../isAuth.js");

// Create and Save a new User
exports.register = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const hashpassword = await hash(req.body.password, 10);
  // Create a User
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: hashpassword,
    score: 0,
    type: "user",
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database.
exports.login = async (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email, async (err, data) => {
    try {
      if (err) {
        if (err.kind === "not_found") throw new Error("User not found");
        else throw new Error("Error when retrieving");
      } else {
        console.log(await hash(password, 10));
        const valid = await compare(password, data.password).catch((e) => {
          throw "Other Error";
        });
        console.log(valid);
        if (!valid) throw new Error("Password not correct");
        const accesstoken = createAccessToken(data.id);
        const refreshtoken = createRefreshToken(data.id);

        // put refresh token in db
        data.refreshtoken = refreshtoken;

        sendRefreshToken(res, refreshtoken);
        sendAccessToken(res, req, accesstoken);
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });
};

// Find a single User with a userId
exports.logout = (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({
    message: "Logged out",
  });
};

// Update a User identified by the userId in the request
exports.protected = (req, res) => {
  // Validate Request
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      res.send({
        data: "this is protected data",
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
};

// Delete a User with the specified userId in the request
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshtoken;
  //if we dun have token
  if (!token) return res.send({ accesstoken: "" });
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }

  const user = fakeDB.find((user) => user.id === payload.userId);
  if (!user) return res.send({ accesstoken: "" });

  if (user.refreshtoken !== token) {
    return res.send({ accesstoken: "" });
  }

  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);

  user.refreshtoken = refreshtoken;

  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
};
