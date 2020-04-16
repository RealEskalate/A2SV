const mongoose = require("mongoose");

const localPolicySchema = new mongoose.Schema({
    location: {
        country: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: false
        }
    },
    action: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: [
                "Social distancing",
                "Movement restrictions",
                "Public health measures",
                "Social and economic measures",
                "Lockdowns"
            ],
            required: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: Date,
    },
    source: {
        source_name: {
            type: String,
            required: true
        },
        source_type: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        }
    }

});

  
const LocalPolicy = mongoose.model("LocalPolicy", localPolicySchema);
  
exports.LocalPolicy = LocalPolicy;