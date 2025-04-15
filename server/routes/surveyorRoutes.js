const express = require("express");
const router = express.Router();
const {
  regController,
  logController,
  surveyors,
} = require("../controllers/surveyorController");

router.post("/surveyorRegister", regController);
router.post("/surveyorLogin", logController);
router.get("/getAllSurveyors", surveyors); // ✅ Fixed here

module.exports = router;
