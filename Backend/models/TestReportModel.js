const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    healthcare_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    patient_status:{
        type: String,
        enum: ["Positive", "Negative"],
        required: true,
        default: "Negative"
    },
    requested_at:{
        type: Date
    },
    reported_at:{
        type: Date,
        required: true
    }

  

});


const Reports = mongoose.model("TestReport", reportSchema);
exports.Reports = Reports;
