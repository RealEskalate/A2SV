const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const medicalhistory_user_schema = new mongoose.Schema({
    medicalhistory_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const MedicalHistoryUser = mongoose.model("MedicalHistoryUser", medicalhistory_user_schema);

exports.MedicalHistoryUser = MedicalHistoryUser;
