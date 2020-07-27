const mongoose = require("mongoose");

const population_schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  country_name: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
    min: 5,
  },
  iso3: {
    type: String,
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
});

const PopulationSchema = mongoose.model("Population", population_schema);
module.exports = PopulationSchema;
