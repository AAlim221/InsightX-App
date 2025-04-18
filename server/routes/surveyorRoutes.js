// 📁 routes/surveyorRoutes.js
const express = require("express");
const {
  regController,
  logController,
  getAllSurveyors,
} = require("../controllers/surveyorController");

const router = express.Router();

router.post("/SurveyorRegister", regController);
router.post("/surveyorLogin", logController);
router.get("/surveyors", getAllSurveyors);

module.exports = router;
