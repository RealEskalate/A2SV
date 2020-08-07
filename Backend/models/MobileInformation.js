const mongoose = require("mongoose");

const mobile_information_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    language: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: Number,
    },
    sytx: {
        type: Number,
    },
    photo: {
        type: String
    },
    name: {
        type: String,
        required: true
    }
});

const MobileInformation = mongoose.model("MobileInformation", mobile_information_schema);
exports.MobileInformation = MobileInformation;