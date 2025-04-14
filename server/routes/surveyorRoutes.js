const express = require("express");
const router = express.Router();
const {
  regController,
  logController,
  getAllSurveyors,
  getSurveyorById,
  deleteSurveyor
} = require("../controllers/surveyorController");

// ✅ Fixed routes first
router.get('/getAllSurveyors', getAllSurveyors);
router.post('/surveyorRegister', regController);
router.post('/surveyorLogin', logController);

// ✅ Dynamic routes later
router.get('/surveyors/:id', getSurveyorById);
router.delete('/surveyors/:id', deleteSurveyor);

module.exports = router;
