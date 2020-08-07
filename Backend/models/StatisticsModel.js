const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  age_group: {
    type: String,
    required: true,
  },
  criteria: {
    type: String,
    required: true,
    enum: ["TEST", "CONFIRMED", "RECOVERED", "DEATH"],
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  AdditionalData: {
    type: Object,
  },
});

const StatisticsSchema = mongoose.model("Statistics", statisticsSchema);

module.exports = StatisticsSchema;
