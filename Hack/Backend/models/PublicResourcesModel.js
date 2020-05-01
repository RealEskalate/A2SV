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
        type: Number,
        required: true,
    },
});
//Make Country and Indicator unique
public_resources_schema.index({ Country: 1, Indicator: 1 }, { unique: true });

const PublicResources = mongoose.model("PublicResources", public_resources_schema);
exports.PublicResourcesData = PublicResources;