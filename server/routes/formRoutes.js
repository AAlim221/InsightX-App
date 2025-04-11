const express = require("express");
const { createForm, getAllForms, submitForm } = require("../controllers/formController");

const router = express.Router();

// Create a new form
router.post("/createForm", createForm);

// Fetch all forms
router.get("/listAllForms", getAllForms);

// Optional: Add route to submit forms if needed
router.post("/submitForm", submitForm);

module.exports = router;
