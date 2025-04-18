const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      "short-answer",
      "paragraph",
      "multiple-choice",
      "checkboxes",
      "linear-scale",
      "rating",
      "multiple-choice-grid",
      "checkbox-grid",
    ],
  },
  response: mongoose.Schema.Types.Mixed,
});

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    // ✅ Add these fields:
    surveyName: { type: String },
    surveyDetails: { type: String },
    peopleDetails: {
      name: String,
      mobile: String,
      age: Number,
      nid: String,
      division: String,
      district: String,
    },

    respondentDetails: {
      name: { type: String, trim: true },
      age: String,
      nid: String,
      mobile: String,
      division: String,
      district: String,
      thana: String,
    },

    answers: [answerSchema],

    reviewStatus: {
      type: String,
      enum: ["pending", "reviewed", "flagged"],
      default: "pending",
    },
  },
  { timestamps: true }
);

responseSchema.index({ formId: 1 });
responseSchema.index({ "respondentDetails.mobile": 1 });

module.exports = mongoose.model("Response", responseSchema);
