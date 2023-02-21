const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const mongoose = require("mongoose");

const auth = async function (req, res, next) {
  try {
    let token;

    let access_token_index = req.rawHeaders.find((el) =>
      el.startsWith("access_token")
    );

    //checking if access_token exists in the raw headers
    //For postman
    if (access_token_index) {
      let splitHeaderToken = access_token_index.split(";", 2);
      let accessToken = splitHeaderToken[0].split("=", 2);

      token = accessToken[1];
      console.log("Access_token Token", token);
    }
    //checked for auth for logged in user
    else if (req.headers.authorization) {
      let splitBearerToken = req.headers.authorization.split(" ", 2);

      token = splitBearerToken[1];
      console.log("Bearer token", token);
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    //finding the user that includes the id and token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("Auth error", e);
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
