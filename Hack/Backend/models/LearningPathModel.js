const mongoose = require("mongoose");

const learning_path_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    what: {
        type: String,
        required: true
    },
    why: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    how: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    age_group: {
        type: String,
        required: true
    },
    language: {
        type: String,
    },
});

const LearningPath = mongoose.model("LearningPath", learning_path_schema);
exports.LearningPath = LearningPath;