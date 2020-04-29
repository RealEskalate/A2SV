const mongoose = require("mongoose");

const diseasesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Number,
    required: true,
  },
  deaths: {
    type: Number,
    required: true,
  },
  recovered: {
    type: Number,
    required: true,
  },
  affected: {
    type: Number,
    required: true,
  },
});

var DiseaseModel = mongoose.model("Disease", diseasesSchema);
module.exports = DiseaseModel;
