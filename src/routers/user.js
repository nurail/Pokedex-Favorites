const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

//POST method for creating user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  console.log("user", user);

  console.log("req.body", req.body);

  try {
    console.log("user", user);
    const userEmail = await User.find({ email: req.body.email }); //find query to find if email already exists
    console.log("userEmail", userEmail[0]);
    const userUsername = await User.find({ username: req.body.username }); //find query to find if username already exists
    console.log("userUsername", userUsername[0]);

    //checking if username or email already exists
    if (userEmail[0]) {
      throw new Error("Email already exists");
    } else if (userUsername[0]) {
      throw new Error("Username already exists");
    }

    let resp = await user.save();
    console.log("resp", resp);
    const token = await user.generateAuthToken();
    console.log("token", token);

    res.status(201).send({ user, token });
  } catch (e) {
    console.log("Error", e);
    res.status(400).json({ error: `${e}` });
  }
});

//POST method to login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    ); //statics call in models

    console.log("USER:", user);

    const token = await user.generateAuthToken();
    console.log("token", token);

    //sets access_token cookie
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ user, token });
  } catch (e) {
    console.log("Error 2:", e);
    res.status(400).json({ error: `${e}` });
  }
});

//Reads all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

//POST method to add favorite to new set
router.post("/users/favorite", auth, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Not logged in");
    }

    //Checking if the set name exists in that user
    if (!req.user.fav_pokemon_sets.groupName) {
      let user = req.user.fav_pokemon_sets.find((el) => {
        return (
          req.body.fav_pokemon.fav_pokemon_sets[0].groupName == el.groupName
        );
      });
      console.log("user", user);

      //Adding favorite to new set if set name for that user does not exist
      if (!user) {
        req.user.fav_pokemon_sets = req.user.fav_pokemon_sets.concat(
          req.body.fav_pokemon.fav_pokemon_sets[0]
        );
      }
      //Adding favorite to set found in that user
      else {
        user.fav_pokemon = user.fav_pokemon.concat(
          req.body.fav_pokemon.fav_pokemon_sets[0].fav_pokemon
        );
      }
    }

    console.log("updated user", req.user);

    req.user.save().then(function (err, result) {
      console.log("User Updated");
      res.status(200).json({ Message: "User Updated" });
    });
  } catch (e) {
    console.log("Error", e);
    res.status(500).send(e);
  }
});

//POST method to remove favorite
router.post("/users/removefavorite", auth, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Not logged in");
    }

    //finding the set using the group name and returning that user set
    let user = req.user.fav_pokemon_sets.find((el) => {
      if (el.groupName == req.body.fav_pokemon.fav_pokemon_sets[0].groupName) {
        return el;
      }
    });
    console.log("user", user);

    //updating the user by filtering the unselected favorite
    user.fav_pokemon = user.fav_pokemon.filter((el) => {
      if (
        el.name !== req.body.fav_pokemon.fav_pokemon_sets[0].fav_pokemon[0].name
      ) {
        return el;
      }
    });
    console.log("Updated user:", user.fav_pokemon);

    req.user.save().then(function (err, result) {
      console.log("User Updated");
      res.status(200).json({ Message: "User Updated" });
    });
  } catch (e) {
    console.log("Error", e);
  }
});

//GET method to read all the users to display favorites
router.get("/users/favPokemonArray", auth, async (req, res) => {
  console.log("req.user.fav_pokemon_sets", req.user.fav_pokemon_sets);
  return res.send(req.user.fav_pokemon_sets);
});

//POST method for the list of favorite pokemon for that set - to define button properties
router.post("/users/favPokemonArray", auth, async (req, res) => {
  let user = req.user.fav_pokemon_sets.find((el) => {
    return el.groupName == req.body.groupName;
  });
  console.log(user);
  return res.send(user);
});

//Logout user
router.get("/users/logout", auth, (req, res) => {
  try {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
