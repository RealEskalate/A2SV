const mongoose = require("mongoose");

const contactTracingSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
        default: "MALE",
    },
    relationship: {
        type: String,
        enum: [
            "FAMILY",
            "PARTNER_OR_ROOMMATE",
            "HEALTH_CARE_WORKER",
            "NEIGHBOR",
            "CO_WORKER",
            "FRIEND",
            "TEACHER",
            "SERVICE_PROVIDER",
            "OTHER",
        ],
    },
    type: {
        type: String,
        enum: [
            "HOUSEHOLD",
            "HEALTH_CARE",
            "NURSING",
            "NON_MEDICAL_CARETAKER",
            "SCHOOL",
            "WORKPLACE",
            "CHURCH",
            "UNSURE",
            "OTHER",
        ],
    },
    language: {
        type: String,
        enum: ["AMHARIC", "ENGLISH", "AFAAN_OROMO", "TIGRIGNA"],
    },
});
var ContactTracingModel = mongoose.model(
    "ContactTracing",
    contactTracingSchema
);
exports.ContactTracing = ContactTracingModel;
