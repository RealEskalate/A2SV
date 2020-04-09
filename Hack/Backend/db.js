const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://dbAdmin:EOW2tr3cqUcPqp7k@symtrack-zokm9.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    dbName: "hackathon",
  }
);

module.exports = mongoose;
