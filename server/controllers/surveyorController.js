const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const surveyorModel = require('../models/surveyorModel');

// Register Controller
const regController = async (req, res) => {
  try {
    const { name, gmail, surveyorID, password, confirmPassword, mobileNo, nidOrPassport } = req.body;

    // Validation
    if (!name || !gmail || !surveyorID || !password || !confirmPassword || !mobileNo || !nidOrPassport) {
      return res.status(400).send({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existing = await surveyorModel.findOne({ gmail });
    if (existing) {
      return res.status(400).json({ success: false, message: "Surveyor already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save surveyor
    const surveyor = await surveyorModel({
      name,
      gmail,
      surveyorID,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      mobileNo,
      nidOrPassport
    }).save();

    return res.status(201).send({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    console.log(error);
    return res.status(508).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// Login Controller
const logController = async (req, res) => {
  try {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide Gmail and Password"
      });
    }

    const surveyor = await surveyorModel.findOne({ gmail });
    if (!surveyor) {
      return res.status(404).send({
        success: false,
        message: "Surveyor not found"
      });
    }

    const match = await comparePassword(password, surveyor.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Gmail or Password"
      });
    }

    const token = JWT.sign(
      { _id: surveyor._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    surveyor.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login successful!",
      token,
      surveyor,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

// Get All Surveyors
const getSurveyorsController = async (req, res) => {
  try {
    const surveyors = await surveyorModel.find().select("-password -confirmPassword");
    res.status(200).send({
      success: true,
      message: "All surveyors fetched successfully",
      data: surveyors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching surveyors",
      error,
    });
  }
};

// Get Surveyor by ID
const getSurveyorByIdController = async (req, res) => {
  try {
    const surveyor = await surveyorModel.findById(req.params.id).select("-password -confirmPassword");
    if (!surveyor) {
      return res.status(404).send({
        success: false,
        message: "Surveyor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Surveyor fetched successfully",
      data: surveyor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching surveyor",
      error,
    });
  }
};

module.exports = {
  regController,
  logController,
  getSurveyorsController,
  getSurveyorByIdController
};
