const mongoose = require("mongoose");

const localPolicySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    date_terminated: {
        type: Date,
    },
}, {timestamps: {createdAt: 'date_created', updatedAt: 'date_updated'}});

const LocalPolicy = mongoose.model("LocalPolicy", localPolicySchema);
exports.LocalPolicy = LocalPolicy;