const mongoose = require("mongoose");

const worldDataSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  Confirmed: {
    type: Number,
  },
  Recovered: {
    type: Number,
  },
  Deaths: {
    type: Number,
  },
  Test: {
    type: Number,
  },
  date: {
    type: Date,
    index: true,
    required: true,
  },
});

var WorldDataModel = mongoose.model("WorldData", worldDataSchema);
module.exports = WorldDataModel;
