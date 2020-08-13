const mongoose = require("mongoose");

const newCitizenSymptomsSchema = new mongoose.Schema({
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
const NewCitizenSymptoms = mongoose.model(
    "NewCitizenSymptoms",
    newCitizenSymptomsSchema
);
module.exports = NewCitizenSymptoms;
