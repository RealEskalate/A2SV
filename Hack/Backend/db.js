const mongoose = require("mongoose");
// const config = require("./config");
require('dotenv').config()
const app = require('./index');
var connectionString = ""
console.log('env IS ' + (process.env.NODE_ENV))
if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.APP_DB_CONNECTION_TEST
} else {
  connectionString = process.env.APP_DB_CONNECTION
}
mongoose.connect(
  connectionString,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  function (err, res) {
    if (err) {
      console.log('Error connecting to database. ' + err);
    }
    else {
      console.log('Connected to Database! ' + process.env.NODE_ENV + ' via ' + connectionString);
    }
  }
);

module.exports = mongoose;
