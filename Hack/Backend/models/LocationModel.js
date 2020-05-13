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
  place_name: {
    type: String,
    minlength: 3,
  }
});
//Make latitude and longitude unique
locationSchema.index({ longitude: 1, latitude: 1 }, { unique: true });

var LocationModel = mongoose.model("Location", locationSchema);
var DemoLocationModel = mongoose.model("Demo Location", locationSchema);

module.exports = {LocationModel, DemoLocationModel};
