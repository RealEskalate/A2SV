const mongoose = require("mongoose");
const config = require("./config");
const app = require('./index');
mongoose.connect(
  process.env.MONGODB_URI || config.mongoURI[process.env.NODE_ENV || 'development'],
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useFindAndModify: false,
  },
  function (err, res) {
    if (err) {
      console.log('Error connecting to database. ' + err);
    }
    else {
      console.log('Connected to Database! ' + config.mongoURI[process.env.NODE_ENV || 'development']);
    }
  }
);

module.exports = mongoose;