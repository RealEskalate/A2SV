const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['UPDATES', 'SYMPTOM', 'NEWS', 'NOTIFICATION'],
    default: 'NOTIFICATION'
  },
  degree: {
    type: String,
    required: true,
    enum: ['URGENT', 'NORMAL', 'LOW'],
    default: 'LOW'
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
});

var AlertModel = mongoose.model("Alert", alertSchema);
module.exports = AlertModel;
