require("dotenv/config");
const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { fakeDB } = require("./DB.js");
const { isAuth } = require("./isAuth.js");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("./token.js");

const server = express();

server.use(cookieparser());
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Register
server.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exist
    const user = fakeDB.find((user) => user.email === email);
    if (user) throw new Error("User Already Exist");

    const hashpassword = await hash(password, 10);

    fakeDB.push({
      id: fakeDB.lenth,
      email,
      password: hashpassword,
    });
    res.send({ message: "User Created" });
    console.log(fakeDB);
  } catch (err) {
    res.send({ error: `${err.message}` });
  }
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = fakeDB.find((user) => user.email === email);
    if (!user) throw new Error("User does not exist");
    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password not correct");
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    // put refresh token in db
    user.refreshtoken = refreshtoken;
    console.log(fakeDB);
    //
    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

server.post("/logout", async (_req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({
    message: "Logged out",
  });
});

server.post("/protected", async (req, res) => {
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
});

//get a new access token
server.post("/refresh_token", async (req, res) => {
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
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
