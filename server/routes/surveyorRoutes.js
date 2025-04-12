const express = require('express');
const {
  regController,
  logController,
  getSurveyorsController,
  getSurveyorByIdController
} = require('../controllers/surveyorController');

const router = express.Router();

// Register route
router.post('/surveyorRegister', regController);

// Login route
router.post('/surveyorLogin', logController);

// Get all surveyors
router.get('/surveyors', getSurveyorsController);

// Get one surveyor by ID
router.get('/surveyors/:id', getSurveyorByIdController);

module.exports = router;
