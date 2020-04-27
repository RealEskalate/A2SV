const mongoose = require("mongoose");
const config = require('./test/_config');
const express = require('express');
const app = express();
// const url = process.env.MONGODB_URI || "mongodb+srv://dbAdmin:EOW2tr3cqUcPqp7k@symtrack-zokm9.gcp.mongodb.net/test?retryWrites=true&w=majority";
// console.log("env is " + app.settings.env);
console.log("Database connection to " + config.mongoURI[app.settings.env]);
mongoose.connect(
  config.mongoURI[app.settings.env],
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "hackathon",
  }
);

module.exports = mongoose;
