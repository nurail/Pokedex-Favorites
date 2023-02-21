const MongoClient = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";

//connecting mongodb to the localhost
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, strictQuery: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to the database");
    }
    console.log("Connected to the database");
  }
);
