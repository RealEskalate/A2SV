const mongoose = require("mongoose");

const symptom_user_history_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  events: [
    {
      symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Symptom",
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      relevance: {
        type: String,
        required: true,
        enum: ["HIGH", "MEDIUM", "LOW"],
        default: "LOW",
      },
      type: {
        type: String,
        required: true,
        enum: ["TERMINATED", "ONGOING"],
        default: "ONGOING",
      },
    },
  ],
});
const demo_symptom_user_history_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Demo User",
  },
  events: [
    {
      symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Demo Symptom",
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      relevance: {
        type: String,
        required: true,
        enum: ["HIGH", "MEDIUM", "LOW"],
      },
    },
  ],
});
const stress_symptom_user_history_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Stress User",
  },
  events: [
    {
      symptom_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Stress Symptom",
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      relevance: {
        type: String,
        required: true,
        enum: ["HIGH", "MEDIUM", "LOW"],
      },
    },
  ],
});

const SymptomUserHistoryModel = mongoose.model(
  "SymptomUserHistory",
  symptom_user_history_schema
);
const DemoSymptomUserHistoryModel = mongoose.model(
  "Demo SymptomUserHistory",
  demo_symptom_user_history_schema
);
const StressSymptomUserHistoryModel = mongoose.model(
  "Stress SymptomUserHistory",
  stress_symptom_user_history_schema
);

module.exports = {
  SymptomUserHistory: SymptomUserHistoryModel,
  DemoSymptomUserHistory: DemoSymptomUserHistoryModel,
  StressSymptomUserHistory: StressSymptomUserHistoryModel,
};
