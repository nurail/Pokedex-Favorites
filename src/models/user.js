const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    birthday: {
      type: Date,
      required: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    fav_pokemon_sets: [
      {
        groupName: {
          type: String,
          unique: true,
        },
        fav_pokemon: [
          {
            name: {
              type: String,
            },
            accessKey: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

//To remove items to display in the response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//Method to generate a token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });

  user.tokens = user.tokens.concat({ token });
  let resp = await user.save();

  return token;
};

//To find the logged in user
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Wrong email entered");
  }
  if (password !== user.password) {
    throw new Error("Wrong password entered");
  }
  console.log("Matching password");

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
