// routes/responseRoutes.js

const express = require("express");
const router = express.Router();

const {
  submitResponse,
  getResponsesByFormId,
  getSingleResponse,
} = require("../controllers/responseController");

// POST: Submit a response
router.post("/submit", submitResponse);

// GET: All responses for a form
router.get("/form/:formId", getResponsesByFormId);

// GET: One specific response
router.get("/:responseId", getSingleResponse);

module.exports = router;
