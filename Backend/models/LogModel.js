const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: {
    type: Date,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  meta: {
    req: {
      url: String,
      method: String,
      httpVersion: String,
      originalUrl: String,
      query: [],
    },
    res: {
      statusCode: Number,
    },
    responseTime: Number,
  },
});

var LogModel = mongoose.model("Log", logSchema);
module.exports = LogModel;
