const mongoose = require("mongoose");

const casesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    country: {
        type: String,
        required: true,
    },
    country_slug: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Number,
        required: true,
    },
    deaths: {
        type: Number,
        required: true,
    },
    recovered: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

casesSchema.index({ country_slug: 1, date: 1 })

const Cases = mongoose.model("Cases2", casesSchema);
exports.Cases = Cases;