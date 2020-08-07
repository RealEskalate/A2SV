const mongoose = require("mongoose");

const statistics_resource_schema = new mongoose.Schema({
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
    fields: [{}],
    criteria: [{}]
});

const StatisticsResource = mongoose.model("StatisticsResource", statistics_resource_schema);
exports.StatisticsResource = StatisticsResource;