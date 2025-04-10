const express = require('express');
const { registerController, loginController } = require('../controllers/surveyorController')

//router object
const router = express.Router()

//routes
//Register post
router.post('/register',registerController);

//Login post
router.post('/login',loginController);

//export
module.exports = router;