const mongoose = require("mongoose");

const symptom_user_schema = new mongoose.Schema({
    symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    timestamp : { 
        type : Date, 
        default: Date.now 
        }
});
const demo_symptom_user_schema = new mongoose.Schema({
    symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Symptom'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Demo User'
    },
    timestamp : { 
        type : Date, 
        default: Date.now 
        }
});
const stress_symptom_user_schema = new mongoose.Schema({
    symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Symptom'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Stress User'
    },
    timestamp : { 
        type : Date, 
        default: Date.now 
        }
});

const SymptomUserModel = mongoose.model("SymptomUser", symptom_user_schema);
const DemoSymptomUserModel = mongoose.model("Demo SymptomUser", demo_symptom_user_schema);
const StressSymptomUserModel = mongoose.model("Stress SymptomUser", demo_symptom_user_schema);

module.exports = {
    SymptomUser: SymptomUserModel,
    DemoSymptomUser: DemoSymptomUserModel,
    StressSymptomUser: StressSymptomUserModel
}
