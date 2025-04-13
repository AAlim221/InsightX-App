
// 📁 routes/surveyorRoutes.js
// ===========================
const express = require('express');
const { regController, logController } = require('../controllers/surveyorController');

const router = express.Router();

// ✅ Register route
router.post('/surveyorRegister', regController);

// ✅ Login route
router.post('/surveyorLogin', logController);

module.exports = router;
