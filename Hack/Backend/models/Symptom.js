const mongoose = require("mongoose");
const Joi = require("joi");

const symptom_schema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    relevance: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'LOW'
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 100
    }
});

function validateSymptom(symptom) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        relevance: Joi.string()
            .valid('HIGH', 'MEDIUM', 'LOW'),
        description: Joi.string()
            .min(10)
            .max(100)
    }
    return Joi.validate(symptom, schema);
}

const Symptom = mongoose.model("Symptom", symptom_schema);

exports.Symptom = Symptom;
exports.validateSymptom = validateSymptom;