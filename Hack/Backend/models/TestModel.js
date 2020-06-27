const mongoose = require("mongoose");

const testsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  country: {
    type: String,
    required: true,
  },
  country_slug: {
    type: String,
    required: true,
  },
  tests: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
});

testsSchema.index(
  { country_slug: 1, date: 1 },
  { unique: true, background: false }
);

const Tests = mongoose.model("Tests", testsSchema);
exports.Tests = Tests;
