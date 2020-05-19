const mongoose = require("mongoose");
 
const locationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
     },
  },
  place_name: {
    type: String,
    minlength: 3,
  }
});
locationSchema.index({'location': '2dsphere'}, {unique:true})
var LocationModel = mongoose.model("Location", locationSchema);
var DemoLocationModel = mongoose.model("Demo Location", locationSchema);

module.exports = {Location: LocationModel, DemoLocation: DemoLocationModel};
