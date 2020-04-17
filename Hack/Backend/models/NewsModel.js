const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
        },
    
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    country: {
        type: String,
    },
    reference_link: {
        type: String,
    },
});

  
const News = mongoose.model("News", newsSchema);
  
exports.News = News;