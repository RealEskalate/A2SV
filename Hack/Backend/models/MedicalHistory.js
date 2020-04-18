const mongoose = require("mongoose");

const medical_history_schema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 100,
        required: true
    }
});

const MedicalHistory = mongoose.model("MedicalHistory", medical_history_schema);
exports.MedicalHistory = MedicalHistory;