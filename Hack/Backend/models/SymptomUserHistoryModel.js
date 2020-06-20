const mongoose = require("mongoose");

const symptom_user_history_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  events: [
    {
      name: {
        type: String,
        required: true,
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      color: {
        type: String,
        required: true,
        enum: ["HIGH", "MEDIUM", "LOW"],
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
      name: {
        type: String,
        required: true,
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      color: {
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
      name: {
        type: String,
        required: true,
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      color: {
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
