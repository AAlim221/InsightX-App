const express = require("express");
const { createForm, getAllForms, submitForm } = require("../controllers/formController");

//router object
const router = express.Router();

//routes
router.post("/createForm", createForm);
//router.get("/getForms", getAllForms);

module.exports = router;
