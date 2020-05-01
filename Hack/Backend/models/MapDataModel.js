const mongoose = require("mongoose");

const map_data_schema = new mongoose.Schema({    
    State: {
        type: String,
    },
    Country: {
        type: String,
        required: true
    },
    Lat: {
        type: Number,
        required: true
    },
    Long: {
        type: Number,
        required: true
    },
    TimeSeries: {
        type: Object,
        required: true
    }
});

const MapData = mongoose.model("MapData", map_data_schema);
exports.MapData = MapData;