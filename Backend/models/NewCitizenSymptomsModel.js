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
module.exports.NewCitizenSymptoms = NewCitizenSymptoms;


// ------ demo model
const newCitizenSymptomsSchemaDemo = new mongoose.Schema({
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
const NewCitizenSymptomsDemo = mongoose.model(
    "NewCitizenSymptomsDemo",
    newCitizenSymptomsSchemaDemo
);
module.exports.NewCitizenSymptomsDemo = NewCitizenSymptomsDemo;
