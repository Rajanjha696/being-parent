const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userApi = require("./API/user");
const db = require("./db/db");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send({
    status: "ON",
    message: "Api service is running!!",
  });
});

app.use("/api/", userApi);

app.listen(process.env.PORT || 8888, () => {
  console.log("server is up at 8888");
});