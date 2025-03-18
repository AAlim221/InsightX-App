const Response = require("../models/responseModel");

// Submit a response
const submitResponse = async (req, res) => {
  try {
    const { formId, peopleDetails, answers } = req.body;

    if (!formId || !peopleDetails || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure each answer includes a valid questionId and an answer
    answers.forEach(answer => {
      if (!answer.questionId || answer.answer === undefined) {
        throw new Error("Each answer must have a questionId and an answer");
      }
    });

    // Create a new response using the provided formId, peopleDetails, and answers
    const newResponse = new Response({ formId, peopleDetails, answers });

    // Save the new response to the database
    await newResponse.save();

    res.status(201).json({ message: "Response submitted successfully", response: newResponse });
  } catch (error) {
    console.error("Error in submitResponse:", error);
    res.status(500).json({ error: "Error submitting response" });
  }
};

// Fetch responses for a form
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({ error: "formId parameter is required" });
    }

    // Find all responses that match the formId
    const responses = await Response.find({ formId }).populate("answers.questionId");

    res.status(200).json(responses);
  } catch (error) {
    console.error("Error in getResponsesByFormId:", error);
    res.status(500).json({ error: "Error fetching responses" });
  }
};

module.exports = { submitResponse, getResponsesByFormId };
