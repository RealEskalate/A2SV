const mongoose = require("mongoose");
const Joi = require('@hapi/joi');

const interviewSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    clinical_review: {
        type: Boolean,
        required: true,
        default: false,
    },
    completion_date: {
        type: Date,
        required: true,
        default: new Date(Date.now()),
    },
    test_report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestReport",
        required: true,
    },
    interview_report: {
        interviewer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        interview_date: {
            type: Date,
            required: true,
            default: new Date(Date.now()),
        },
        investigation_disposition: {
            type: String,
            required: true,
            enum: [
                "INVALID_PHONE",
                "VALID_PHONE_BUT_NO_VOICE_MESSAGING_FEATURE",
                "LEFT_VOICEMAIL_OR_SMS",
                "UNABLE_TO_REACH_AFTER_2_DAYS",
                "REFUSED_TO_PARTICIPATE",
                "AGREED_TO_CALL",
                "DECEASED",
                "SUSPECTED_OUT_OF_JURISDICTION",
                "CONFIRMED_OUT_OF_JURISDICTION",
                "MED_OR_PSYCH_BARRIERS",
                "LANGUAGE_BARRIER",
                "INCOMPLETE_FOLLOWUP",
                "PARTIAL_COMPLETION",
                "INCARCERATED",
            ],
        },
        source: {
            type: String,
            required: true,
            enum: ["CASE", "PARENT_OR_GUARDIAN", "OTHER"],
        },
    },
    living_situation: {
        situation_type: {
            type: String,
            enum: [
                "SINGLE_FAMILY_HOME",
                "APARTMENT",
                "CARE_FACILITY",
                "OTHER_ADULT_GROUP_LIVING_SETTINGS",
                "SINGLE_RESIDENT_OCCUPANCY",
                "SHELTERS",
                "UNSHELTERED",
                "JAILS",
                "STUDENT_HOUSING",
                "OTHER",
            ],
        },
        occupancy_count: {
            type: Number,
            required: true,
        },
        self_isolation: {
            type: String,
            enum: ["YES", "SOMEWHAT", "NO"],
            default: "NO",
        },
        bathroom_status: {
            type: String,
            enum: ["YES", "UNKNOWN", "NO"],
            default: "NO",
        },
        food_supply: {
            type: String,
            enum: ["YES", "UNKNOWN", "NO"],
            default: "NO",
        },
        additional_help: {
            type: String,
            enum: ["YES", "UNKNOWN", "NO"],
            default: "NO",
        },
    },
    status: {
        occupation: {
            type: String,
            enum: ["HCW", "CITY_WORKER", "STUDENT", "UNEMPLOYED", "OTHER"],
        },
        hospitalized: {
            type: String,
            enum: ["YES", "NO", "DISCHARGED", "UNKNOWN"],
            default: "NO",
        },
        at_home: {
            type: String,
            enum: ["YES", "NO", "UNKNOWN"],
            default: "NO",
        },
        deceased: {
            type: Boolean,
            default: false,
        },
    },
    clinical: {
        recent_symptoms: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Symptom",
        },
        immune_suppression: {
            type: String,
            enum: ["YES", "NO", "UNKNOWN"],
            default: "NO",
        },
    },
    exposures: {
        type: Boolean,
        default: false,
    },
    activities: {
        healthcare_visit: {
            type: Boolean,
            default: false,
        },
        work_visit: {
            type: Boolean,
            default: false,
        },
        school_visit: {
            type: Boolean,
            default: false,
        },
        event_attendance: {
            type: Boolean,
            default: false,
        },
        party_attendance: {
            type: Boolean,
            default: false,
        },
        funeral_attendance: {
            type: Boolean,
            default: false,
        },
        religious_service_attendance: {
            type: Boolean,
            default: false,
        },
        LTCF_or_SNF_visit: {
            type: Boolean,
            default: false,
        },
        flights: {
            type: Boolean,
            default: false,
        },
    },
    work_informations: {
        names: {
            type: String,
        },
        addresses: {
            type: String,
        },
        setting_type: {
            healthcare_facility: {
                type: Boolean,
                default: false,
            },
            longterm_care_facility: {
                type: Boolean,
                default: false,
            },
            daycare: {
                type: Boolean,
                default: false,
            },
            dormitory: {
                type: Boolean,
                default: false,
            },
            immune_compromised: {
                type: Boolean,
                default: false,
            },
            other_care_provider: {
                type: Boolean,
                default: false,
            },
        },
    },
    notes: {
        type: String,
        required: true,
    },
});


const validSchema = Joi.object({
    patient_id: Joi.custom(objectIdValidator).required(),
    clinical_review: Joi.boolean().required(),
    completion_date: Joi.date().required(),
    test_report: Joi.custom(objectIdValidator).required(),
    interview_report: Joi.object().keys({
        interviewer_id: Joi.custom(objectIdValidator).required(),
        interview_date: Joi.date().required(),
        investigation_disposition: Joi.string().valid(
            "INVALID_PHONE",
            "VALID_PHONE_BUT_NO_VOICE_MESSAGING_FEATURE",
            "LEFT_VOICEMAIL_OR_SMS",
            "UNABLE_TO_REACH_AFTER_2_DAYS",
            "REFUSED_TO_PARTICIPATE",
            "AGREED_TO_CALL",
            "DECEASED",
            "SUSPECTED_OUT_OF_JURISDICTION",
            "CONFIRMED_OUT_OF_JURISDICTION",
            "MED_OR_PSYCH_BARRIERS",
            "LANGUAGE_BARRIER",
            "INCOMPLETE_FOLLOWUP",
            "PARTIAL_COMPLETION",
            "INCARCERATED",
        ).required(),
        source: Joi.string().valid(
            "CASE",
            "PARENT_OR_GUARDIAN",
            "OTHER"
        ).required()
    }),
    living_situation: Joi.object().keys({
        situation_type: Joi.string().valid(
            "SINGLE_FAMILY_HOME",
            "APARTMENT",
            "CARE_FACILITY",
            "OTHER_ADULT_GROUP_LIVING_SETTINGS",
            "SINGLE_RESIDENT_OCCUPANCY",
            "SHELTERS",
            "UNSHELTERED",
            "JAILS",
            "STUDENT_HOUSING",
            "OTHER"
        ),
        occupancy_count: Joi.number().required(),
        self_isolation: Joi.string().valid(
            "YES",
            "SOMEWHAT",
            "NO"
        ),
        bathroom_status: Joi.string().valid(
            "YES",
            "UNKNOWN",
            "NO"
        ),
        food_supply: Joi.string().valid(
            "YES",
            "UNKNOWN",
            "NO"
        ),
        additional_help: Joi.string().valid(
            "YES",
            "UNKNOWN",
            "NO"
        )
    }),
    status: Joi.object().keys({
        occupation: Joi.string().valid(
            "HCW",
            "CITY_WORKER",
            "STUDENT",
            "UNEMPLOYED",
            "OTHER"
        ),
        hospitalized: Joi.string().valid(
            "YES",
            "NO",
            "DISCHARGED",
            "UNKNOWN"
        ),
        at_home: Joi.string().valid(
            "YES",
            "UNKNOWN",
            "NO"
        ),
        deceased: Joi.boolean()
    }),
    clinical: Joi.object().keys({
        recent_symptoms: Joi.array().items(Joi.custom(objectIdValidator)),
        immune_suppression: Joi.string().valid(
            "YES",
            "UNKNOWN",
            "NO"
        )
    }),
    exposures: Joi.boolean(),
    activities: Joi.object().keys({
        healthcare_visit: Joi.boolean(),
        work_visit: Joi.boolean(),
        school_visit: Joi.boolean(),
        event_attendance: Joi.boolean(),
        party_attendance: Joi.boolean(),
        funeral_attendance: Joi.boolean(),
        religious_service_attendance: Joi.boolean(),
        LTCF_or_SNF_visit: Joi.boolean(),
        flights: Joi.boolean(),
    }),
    work_informations: Joi.object().keys({
        names: Joi.string(),
        addresses: Joi.string(),
        setting_type: Joi.object().keys({
            healthcare_facility: Joi.boolean(),
            longterm_care_facility: Joi.boolean(),
            daycare: Joi.boolean(),
            dormitory: Joi.boolean(),
            immune_compromised: Joi.boolean(),
            other_care_provider: Joi.boolean()
        })
    }),
    notes: Joi.string().required()
})

function objectIdValidator(value, helpers) {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return value
    }
    return helpers.message('must be a valid object id')
}

var InterviewModel = mongoose.model("Interview", interviewSchema);
exports.Interview = InterviewModel;
exports.validationSchema = validSchema
