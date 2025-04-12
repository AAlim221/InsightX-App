const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  response: mongoose.Schema.Types.Mixed,
});

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    respondentDetails: {
      name: String,
      age: String,
      nid: String,
      mobile: String,
      division: String,
      district: String,
      thana: String,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
