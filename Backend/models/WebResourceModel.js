const mongoose = require("mongoose");

const web_resource_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
    }
});

const WebResource = mongoose.model("web resource", web_resource_schema);
exports.WebResource = WebResource;