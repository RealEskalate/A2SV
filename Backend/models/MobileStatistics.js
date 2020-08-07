const mongoose = require("mongoose");

const mobile_statistics_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    descriptions: [{}],

    language: {
        type: String,
        required: true,
    },

    filter: {
        type: String,
        required: true,
    }
});

const MobileStatistics = mongoose.model("Mobile Statistics", mobile_statistics_schema);
exports.MobileStatistics = MobileStatistics;