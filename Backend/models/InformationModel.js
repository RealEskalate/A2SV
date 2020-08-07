const mongoose = require("mongoose");

const information_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    type: {
        type: String
    }
});

const Information = mongoose.model("InformationSection", information_schema);
exports.Information = Information;