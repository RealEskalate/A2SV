const mongoose = require("mongoose");

const caseInvestigationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String,
        required: true
    },

},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });


const CaseInvestigation = mongoose.model("CaseInvestigation", caseInvestigationSchema);
exports.CaseInvestigation = CaseInvestigation;
