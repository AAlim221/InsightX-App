const express = require("express");
const {
  createForm,
  getAllForms,
  getFormById,
  getFormsByResearcher, // ✅ This must be imported
  submitForm,
} = require("../controllers/formController");

const router = express.Router();

// ✅ Routes
router.post("/createForm", createForm);
router.get("/listAllForms", getAllForms);
router.get("/getFormById/:formId", getFormById);
router.get("/byResearcher/:researcherId", getFormsByResearcher); // ✅ This route enables your dashboard fetch
router.post("/submitForm", submitForm);

module.exports = router;
