const mongoose = require("mongoose");

const testReportSchema = new mongoose.Schema({
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
    test_status:{
        type: String,
        enum: ["Positive", "Negative","Not Tested","Recovered"],
        required: true,
        default: "New"
    },

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const TestReport = mongoose.model("TestReport", testReportSchema);
exports.TestReport = TestReport;
