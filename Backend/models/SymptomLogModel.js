const mongoose = require("mongoose");

const symptom_log_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['SYMPTOM_SUBMITTED', 'SYMPTOM_UPDATED', 'SYMPTOMS_REMOVED'],
        required: true
    },
    current_symptoms: {
        type : {
            date: {
                type: Date,
                required: false,
            },
            source: {
                type: String,
                enum: ['MOBILE', 'WEB']
            },
            symptoms:{
                type: [
                    {                        
                        type: mongoose.Schema.Types.ObjectId,
                        required: false,
                        ref: "Symptom",                  
                    }                
                ],
                default: undefined
            },           
            risk_score: {
                type: Number,
                required: false,
            },
            location : {
                type : {
                    country: {
                        type: String
                    },
                    district: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "District",
                        required: false
                    },   
                },
                default : undefined           
            }
        },
        default : undefined
    },
    history: {
        type : [
            {
                date: {
                    type: Date,
                    required: false,
                },
                source: {
                    type: String,
                    enum: ['MOBILE', 'WEB']
                },
                symptoms:{
                    type: [
                        {                        
                            type: mongoose.Schema.Types.ObjectId,
                            required: false,
                            ref: "Symptom",                  
                        }                
                    ],
                    default: undefined
                },           
                risk_score: {
                    type: Number,
                    required: false,
                },
                location : {
                    country: {
                        type: String
                    },
                    district: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "District",
                        required: false
                    },                
                }
            },
        ],
        default : undefined
    }
});

const SymptomLog = mongoose.model("SymptomLog", symptom_log_schema);

exports.SymptomLog = SymptomLog;