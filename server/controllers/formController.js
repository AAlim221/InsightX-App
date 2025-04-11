const JWT = require('jsonwebtoken');
const formsModel = require('../models/formsModel'); // Assuming this is your Mongoose schema

// Create a new form
const createForm = async (req, res) => {
  try {
    const { title, surveyName, surveyDetails, questions, peopleDetails } = req.body;

    console.log("Received Data:", req.body);

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Missing title or questions or questions is not an array" });
    }

    for (const question of questions) {
      const { type, options, minValue, maxValue, rows, columns } = question;

      if (
        (["multiple-choice", "checkboxes", "multiple-choice-grid", "checkbox-grid"].includes(type)) &&
        (!options || options.length === 0)
      ) {
        return res.status(400).json({ error: `Options must be provided for question type: ${type}` });
      }

      if (
        (["linear-scale", "rating"].includes(type)) &&
        (minValue === undefined || maxValue === undefined)
      ) {
        return res.status(400).json({ error: `Min and Max values must be provided for ${type}` });
      }

      if (
        (["multiple-choice-grid", "checkbox-grid"].includes(type)) &&
        (!rows || !columns || rows.length === 0 || columns.length === 0)
      ) {
        return res.status(400).json({ error: `Rows and Columns must be provided for ${type}` });
      }
    }

    const newForm = new formsModel({
      title,
      surveyName,
      surveyDetails,
      peopleDetails: peopleDetails || {},
      questions,
    });

    await newForm.save();

    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (error) {
    console.error("Error in createForm:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get all forms
const getAllForms = async (req, res) => {
  try {
    const forms = await formsModel.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch forms', error });
  }
};

// Placeholder for submitForm
const submitForm = async (req, res) => {
  res.status(200).json({ message: "Submit form not implemented yet" });
};

// Export all three
module.exports = {
  createForm,
  getAllForms,
  submitForm,
};
