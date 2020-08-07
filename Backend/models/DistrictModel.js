const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    boundaries: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: true
        }
    }
});

const DistrictModel = mongoose.model("District", districtSchema);

exports.DistrictModel = DistrictModel;