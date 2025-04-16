// routes/analysis.js

const express = require("express");
const router = express.Router();
const Form = require("../models/formModel");
const Response = require("../models/responseModel");
const calculateMPIForRespondents = require("../utils/calculateMPI");

// GET /api/analysis/:formId
router.get("/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const responses = await Response.find({ formId: form._id });

    const analysis = calculateMPIForRespondents(form, responses);

    const averageMPI = (
      analysis.reduce((sum, r) => sum + r.mpiScore, 0) / analysis.length
    ).toFixed(2);

    const vulnerableCount = analysis.filter((r) => r.isVulnerable).length;

    res.json({
      formId: form._id,
      formTitle: form.title,
      totalRespondents: responses.length,
      vulnerableCount,
      averageMPI,
      respondentBreakdown: analysis,
    });
  } catch (err) {
    console.error("Error calculating MPI:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
