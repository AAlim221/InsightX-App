const mongoose = require("mongoose");

const surveyorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    surveyorID: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    mobileNo: { type: String, required: true },
    nidOrPassport: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Surveyor", surveyorSchema);
