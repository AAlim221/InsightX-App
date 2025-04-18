// File: models/formsModel.js

const mongoose = require("mongoose");

const MPISchema = new mongoose.Schema({
  isMPIIndicator: { type: Boolean, default: false },
  dimension: { type: String },
  conditionType: {
    type: String,
    enum: ["lessThan", "greaterThan", "equals", "notEquals", "includes"],
  },
  value: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "short-answer",
      "paragraph",
      "multiple-choice",
      "checkboxes",
      "linear-scale",
      "rating",
      "multiple-choice-grid",
      "checkbox-grid"
    ],
    required: true
  },
  options: [{ type: String }],
  minValue: { type: Number },
  maxValue: { type: Number },
  rows: [{ type: String }],
  columns: [{ type: String }],
  mpi: MPISchema
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  researcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  peopleDetails: {
    name: { type: String },
    mobile: { type: String },
    age: { type: Number },
    nid: { type: String },
    division: { type: String },
    district: { type: String }
  },
  surveyName: { type: String },
  surveyDetails: { type: String },
  questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Form", FormSchema);
