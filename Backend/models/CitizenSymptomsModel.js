const mongoose = require("mongoose");

const citizenSymptomsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true,
        unique: true,
    },
    total: {
        type: Number,
        required: true,
    },
});
const CitizenSymptoms = mongoose.model(
    "CitizenSymptoms",
    citizenSymptomsSchema
);
module.exports = CitizenSymptoms;
