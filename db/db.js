const mongoose = require("mongoose");

var mongoDB =
  "mongodb+srv://Kashyap:Kashyap123@cluster0.8gffr.mongodb.net/being-parent?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Connected to DB");
});

module.exports = db;