
// 📁 routes/surveyorRoutes.js
// ===========================
const express = require('express');
const { regController, logController, getAllSurveyors } = require('../controllers/surveyorController');
const router = express.Router();

// ✅ Register route
router.post('/surveyorRegister', regController);

// ✅ Login route
router.post('/surveyorLogin', logController);

// ✅ NEW: Get all surveyors
router.get('/surveyors', getAllSurveyors);


module.exports = router;
