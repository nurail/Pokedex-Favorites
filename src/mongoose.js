const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

//connecting to the database
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully connected to DB");
    }
  }
);
