const express = require("express");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const mongoose = require("./mongoose");
const userRouter = require("./routers/user");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(userRouter);
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
