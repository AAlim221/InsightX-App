const express = require('express');
const { regController, logController } = require('../controllers/surveyorController')

//router object
const router = express.Router()

//routes
//Register post
router.post('/surveyorRegister',regController);

//Login post
router.post('/surveyorLogin',logController);

//export
module.exports = router;