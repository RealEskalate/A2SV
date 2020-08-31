const mongoose = require("mongoose");

const clinicalDispositionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    interview_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Interview'
    },
    disposition: {
        type: String,
        enum: ['Pending', 'Complete'],
        required: true
    },
    notes: {
        type: String,
        required: true
    },

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const ClinicalDisposition = mongoose.model("ClinicalDisposition", clinicalDispositionSchema);
exports.ClinicalDisposition = ClinicalDisposition;
