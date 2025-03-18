const mongoose = require("mongoose");

// Define the schema for response to the form
const ResponseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "formsModel", // Refers to the form this response is associated with
    required: true 
  },
  peopleDetails: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    nid: { type: String, required: true },
    mobile: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true }
  },
  answers: [
    {
      questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "formsModel.questions", // Links to the specific question in the form
        required: true
      },
      answer: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
      }
    }
  ],
  submittedAt: { 
    type: Date, 
    default: Date.now 
  } // Submission timestamp
});

module.exports = mongoose.model("Response", ResponseSchema);
