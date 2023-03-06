const express = require("express");
const path = require("path");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const mongoose = require("./src/mongoose");
const userRouter = require("./src/routers/user");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(userRouter);
app.use(cookieParser());

app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "views")));
app.engine("html", require("ejs").renderFile);

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
