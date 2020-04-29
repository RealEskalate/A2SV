const mongoose = require("mongoose");

const alertUserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  alert_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
    required: true,
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false
  },
});
//Make latitude and longitude unique
alertUserSchema.index({ user_id: 1, alert_id: 1 }, { unique: true });

var AlertUserModel = mongoose.model("AlertUser", alertUserSchema);
module.exports = AlertUserModel;
