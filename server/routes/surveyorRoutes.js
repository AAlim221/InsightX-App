
// 📁 routes/surveyorRoutes.js
// ===========================
const express = require('express');
const { regController, logController, getAllSurveyors } = require('../controllers/surveyorController');
const router = express.Router();

router.post('/SurveyorRegister', (req, res) => {
    console.log("Query Params:", req.query);  // Log the query parameters
    // Get the formId from the query parameters
    const formId = req.query.formId;
    console.log("Received Form ID:", formId);  // Log to verify it's received
  
    // Check if formId is provided
    if (!formId) {
      return res.status(400).json({ error: "Form ID is required" });
    }
  
    // Proceed with your logic here (e.g., registering the surveyor)
    regController(req, res); // You can call your registration controller here
  
    // If you want to use formId inside your registration logic, you can access it like:
    // const { name, gmail, surveyorID, password, confirmPassword, mobileNo, nidOrPassport } = req.body;
    // And include formId in your registration logic
  });

// ✅ Login route
router.post('/surveyorLogin', logController);

// ✅ NEW: Get all surveyors
router.get('/surveyors', getAllSurveyors);


module.exports = router;