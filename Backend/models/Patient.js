const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    phone_number: {
        type: String,
    },
    language: {
        type: String,
        enum: ["English", "Amharic", "Oromo", "Turkish"],
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "UNDISCLOSED"],
        required: true,
    },
    woreda: {
        type: String,
    },
    street_address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    sms_status: {
        type: Boolean,
    },
    emergency_contact:{
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        relationship:{
            type: String,
        },
        city:{
            type: String,
        },
        state: {
            type: String,
        },
        phone_number:{
            type: String,
        },
    }

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const Patient = mongoose.model("Patient", patientSchema);
exports.Patient = Patient;
