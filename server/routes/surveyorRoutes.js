// ===========================
// File: routes/surveyorRoutes.js
// ===========================
const express = require('express');
const {
  regController,
  logController,
  getSurveyorsController,
  getSurveyorByIdController,
} = require('../controllers/surveyorController');

const router = express.Router();

router.post('/surveyorRegister', regController);
router.post('/surveyorLogin', logController);
router.get('/surveyors', getSurveyorsController);
router.get('/surveyors/:id', getSurveyorByIdController);

module.exports = router;