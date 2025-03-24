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
  options: [String], // Options for multiple-choice, checkboxes, multiple-choice grid, checkbox grid
  minValue: { type: Number }, // For linear scale and rating (optional)
  maxValue: { type: Number }, // For linear scale and rating (optional)
  rows: [String], // For multiple-choice grid and checkbox grid (optional)
  columns: [String] // For multiple-choice grid and checkbox grid (optional)
});

// Define the schema for Form
const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [QuestionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Form', FormSchema);
