const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

var LocationModel = mongoose.model("Location", locationSchema);
module.exports = LocationModel;
