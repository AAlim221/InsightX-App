const formsModel = require("../models/formsModel");

const createForm = async (req, res) => {
  try {
    const {
      title,
      surveyName,
      surveyDetails,
      questions,
      peopleDetails,
      researcherId
    } = req.body;

    if (!title || !questions || !Array.isArray(questions) || !researcherId) {
      return res.status(400).json({
        message: "Missing required fields: title, questions array, or researcherId"
      });
    }

    // Clean MPI data
    const cleanedQuestions = questions.map((q) => {
      const cleaned = { ...q };
      if (!cleaned.mpi || !cleaned.mpi.isMPIIndicator) {
        delete cleaned.mpi;
      } else {
        // Ensure required MPI fields exist
        if (
          !cleaned.mpi.dimension ||
          !cleaned.mpi.conditionType ||
          cleaned.mpi.value === undefined
        ) {
          return res.status(400).json({
            message: `MPI indicator requires dimension, conditionType, and value`
          });
        }
      }
      return cleaned;
    });

    // Validate each question
    for (const question of cleanedQuestions) {
      const { type, options, minValue, maxValue, rows, columns } = question;

      if (
        ["multiple-choice", "checkboxes"].includes(type) &&
        (!options || options.length === 0)
      ) {
        return res.status(400).json({
          message: `Options are required for ${type} type`
        });
      }

      if (
        ["linear-scale", "rating"].includes(type) &&
        (minValue === undefined || maxValue === undefined)
      ) {
        return res.status(400).json({
          message: `Min and Max values are required for ${type} type`
        });
      }

      if (
        ["multiple-choice-grid", "checkbox-grid"].includes(type) &&
        (!rows || !columns || rows.length === 0 || columns.length === 0)
      ) {
        return res.status(400).json({
          message: `Rows and Columns are required for ${type} type`
        });
      }
    }

    const newForm = new formsModel({
      title,
      researcherId,
      surveyName,
      surveyDetails,
      peopleDetails: peopleDetails || {},
      questions: cleanedQuestions
    });

    await newForm.save();

    res.status(201).json({
      message: "Form created successfully",
      form: newForm
    });
  } catch (error) {
    console.error("Error in createForm:", error);
    res.status(500).json({ message: "Server error while creating form" });
  }
};

module.exports = {
  createForm,
  getAllForms: async (_, res) => {
    try {
      const forms = await formsModel.find();
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forms", error });
    }
  },
  getFormById: async (req, res) => {
    try {
      const form = await formsModel.findById(req.params.formId);
      if (!form) return res.status(404).json({ message: "Form not found" });
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
  getFormsByResearcher: async (req, res) => {
    try {
      const forms = await formsModel.find({ researcherId: req.params.researcherId });
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forms", error });
    }
  },
  submitForm: async (_, res) => {
    res.status(200).json({ message: "Submit form not implemented yet" });
  }
};
