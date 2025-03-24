const JWT = require('jsonwebtoken');
const formsModel = require('../models/formsModel');

// Create a new form
const createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const validTypes = [
      "short-answer",
      "paragraph",
      "multiple-choice",
      "checkboxes",
      "linear-scale",
      "rating",
      "multiple-choice-grid",
      "checkbox-grid"
    ];

    // Validate the required fields
    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Missing title or questions or questions is not an array" });
    }

    // Validate questions
    for (const question of questions) {
      const { type, options, minValue, maxValue, rows, columns } = question;

      // Validate type for each question
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid question type: ${type}` });
      }

      // If type is "multiple-choice" or "checkboxes", validate the options
      if ((type === "multiple-choice" || type === "checkboxes" || type === "multiple-choice-grid" || type === "checkbox-grid") && (!options || options.length === 0)) {
        return res.status(400).json({ error: `Options must be provided for question type: ${type}` });
      }

      // If type is "linear-scale" or "rating", ensure min/max values are set
      if ((type === "linear-scale" || type === "rating") && (minValue === undefined || maxValue === undefined)) {
        return res.status(400).json({ error: `Min and Max values must be provided for ${type}` });
      }

      // For multiple-choice grid or checkbox grid, ensure rows and columns are provided
      if ((type === "multiple-choice-grid" || type === "checkbox-grid") && (!rows || !columns || rows.length === 0 || columns.length === 0)) {
        return res.status(400).json({ error: `Rows and Columns must be provided for ${type}` });
      }
    }

    // Create the new form object
    const newForm = new formsModel({ title, questions });

    // Save the form to the database
    await newForm.save();

    // Return the success response
    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (error) {
    console.error("Error in createForm:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Export the createForm function
module.exports = { createForm };
