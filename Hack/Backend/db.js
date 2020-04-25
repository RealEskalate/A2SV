const mongoose = require("mongoose");
const url = process.env.MONGODB_URI || "mongodb+srv://dbAdmin:EOW2tr3cqUcPqp7k@symtrack-zokm9.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(
  url,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "hackathon",
  }
);

module.exports = mongoose;
