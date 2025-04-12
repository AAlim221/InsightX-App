const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const surveyorModel = require('../models/surveyorModel');

// Register
const regController = async (req, res) => {
  try {
    const { name, gmail, surveyorID, password, confirmPassword, mobileNo, nidOrPassport } = req.body;

    if (!name || !gmail || !surveyorID || !password || !confirmPassword || !mobileNo || !nidOrPassport) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existing = await surveyorModel.findOne({ gmail });
    if (existing) return res.status(400).json({ success: false, message: "Surveyor already exists" });

    const hashedPassword = await hashPassword(password);

    await new surveyorModel({
      name,
      gmail,
      surveyorID,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      mobileNo,
      nidOrPassport
    }).save();

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};

// Login
const logController = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const surveyor = await surveyorModel.findOne({ gmail });

    if (!surveyor) return res.status(404).json({ success: false, message: "Surveyor not found" });

    const match = await comparePassword(password, surveyor.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = JWT.sign({ _id: surveyor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    surveyor.password = undefined;

    res.status(200).json({ success: true, message: "Login successful", token, surveyor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};

// Get All Surveyors
const getSurveyorsController = async (req, res) => {
  try {
    const surveyors = await surveyorModel.find().select("-password -confirmPassword");
    res.status(200).json({ success: true, message: "Fetched all surveyors", data: surveyors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed", error });
  }
};

// Get One Surveyor
const getSurveyorByIdController = async (req, res) => {
  try {
    const surveyor = await surveyorModel.findById(req.params.id).select("-password -confirmPassword");
    if (!surveyor) return res.status(404).json({ success: false, message: "Surveyor not found" });

    res.status(200).json({ success: true, message: "Fetched one surveyor", data: surveyor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error", error });
  }
};

module.exports = {
  regController,
  logController,
  getSurveyorsController,
  getSurveyorByIdController
};
