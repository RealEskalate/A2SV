const mongoose = require("mongoose");

const ethiopiaDataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  region: {
    type: String,
  },
  region_code: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  total: {},
  daily: {},
  test: {
    type: Number
  },
  date: {
    type: Date,
    required: true,
  }, 

}, {timestamps : true});

var EthiopiaDataModel = mongoose.model("EthiopiaData", ethiopiaDataSchema);
module.exports = EthiopiaDataModel;
