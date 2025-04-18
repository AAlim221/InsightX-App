// =======================
// File: controllers/responseController.js
// =======================

const Response = require("../models/responseModel");

// Submit response
const submitResponse = async (req, res) => {
  try {
    // ✅ Log incoming data
    console.log("📩 Incoming Submission:", req.body);

    const {
      formId,
      respondentDetails,
      answers,
      surveyName,
      surveyDetails,
      peopleDetails,
    } = req.body;

    if (!formId || !answers) {
      return res.status(400).json({ message: "Form ID and answers are required." });
    }

    const newResponse = new Response({
      formId,
      respondentDetails,
      surveyName,
      surveyDetails,
      peopleDetails,
      answers,
      submittedAt: new Date(),
    });

    await newResponse.save();

    console.log("✅ Response saved:", newResponse);
    res.status(201).json({ message: "Response submitted successfully." });
  } catch (error) {
    console.error("❌ Submit error:", error);
    res.status(500).json({ message: "Failed to submit response", error: error.message });
  }
};

// Get responses by formId
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await Response.find({ formId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch responses", error });
  }
};

// Get a single response
const getSingleResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: "Not found" });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving response", error });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
  getSingleResponse,
};
