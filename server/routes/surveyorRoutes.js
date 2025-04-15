// 📁 routes/surveyorRoutes.js
const express = require('express');
const {
  regController,
  logController,
  getAllSurveyors,
  getSurveyorById,
  deleteSurveyor,
  updateSurveyor,
} = require('../controllers/surveyorController');

const router = express.Router();

// ✅ Register
router.post('/surveyorRegister', regController);

// ✅ Login
router.post('/surveyorLogin', logController);

// ✅ Get all surveyors
router.get('/surveyors', getAllSurveyors);

// ✅ Get one surveyor by ID
router.get('/surveyors/:id', getSurveyorById);

// ✅ Update surveyor
router.put('/surveyors/:id', updateSurveyor);

// ✅ Delete surveyor
router.delete('/surveyors/:id', deleteSurveyor);

module.exports = router;
