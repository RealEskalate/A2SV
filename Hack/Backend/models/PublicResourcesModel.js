const mongoose = require("mongoose");

const public_resources_schema = new mongoose.Schema({    
    Country: {
        type: String,
        required: true,
    },
    Indicator: {
        type: String,
        required: true,
    },
    TimeSeries: {
        type: Object,
        required: true,
    },
});

const PublicResources = mongoose.model("PublicResources", public_resources_schema);
exports.PublicResourcesData = PublicResources;