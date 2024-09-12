var express = require("express");
var cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./passport");
const passport = require("passport");
const mongoose = require("./dbconnect");
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
const routes = require("./router");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/", routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
port = process.env.PORT || 5000
app.listen(port, () => {
  console.log("Server is running");
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});
