// 📁 routes/surveyorRoutes.js
const express = require('express');
const {
  regController,
  logController,
  getAllSurveyors,
} = require('../controllers/surveyorController');

const router = express.Router();

// ✅ Register
router.post('/surveyorRegister', regController);

// ✅ Login
router.post('/surveyorLogin', logController);

// ✅ Get all surveyors
router.get('/getAllSurveyors', getAllSurveyors);

module.exports = router;
