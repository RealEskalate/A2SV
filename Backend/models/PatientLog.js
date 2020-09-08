const mongoose = require("mongoose");

const patientLogSchema = new mongoose.Schema({
    count:{
        type:Number,
        required: true,
        default: 1
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    test_status:{
        type: String,
        enum: ["New","Positive", "Negative","Not Tested","Recovered","Deceased"],
        default: "New",
        index: true
    },

});


const PatientLog = mongoose.model("PatientLog", patientLogSchema);
exports.PatientLog = PatientLog;
