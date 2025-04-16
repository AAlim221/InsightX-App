const express = require("express");
const { createForm, getAllForms, getFormById, submitForm } = require("../controllers/formController");

const router = express.Router();

// Create a new form
router.post("/createForm", createForm);

// Fetch all forms
router.get("/listAllForms", getAllForms);

// Fetch a form by formId
router.get("/getFormById/:formId", getFormById); // Change to formId here

// Optional: Add route to submit forms if needed
router.post("/submitForm", submitForm);

module.exports = router;
