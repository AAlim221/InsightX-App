const mongoose = require('mongoose');

// Define the schema for Question
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
  options: [{ type: String }], // Optional unless required by the question type
  minValue: { type: Number }, // For linear scale and rating
  maxValue: { type: Number }, // For linear scale and rating
  rows: [{ type: String }], // For multiple-choice grid and checkbox grid
  columns: [{ type: String }] // For multiple-choice grid and checkbox grid
});

// Define the schema for Form
const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    peopleDetails: {
      name: { type: String,required: false },
      mobile: { type: String,required: false },
      age: { type: Number, required: false },
      nid: { type: String, required: false },
      division: { type: String, required: false },
      district: { type: String, required: false }
    },
    surveyName: { type: String, required: false },
    surveyDetails: { type: String, required: false },
    questions: [QuestionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', FormSchema);
