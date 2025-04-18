// 📁 controllers/surveyorController.js
const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const surveyorModel = require("../models/surveyorModel");

// Register Surveyor
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
      nidOrPassport,
    }).save();

    res.status(201).json({ success: true, message: "Surveyor registered successfully" });
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

// Login Surveyor
const logController = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const surveyor = await surveyorModel.findOne({ gmail });

    if (!surveyor) {
      return res.status(404).json({ success: false, message: "Surveyor not found" });
    }

    const match = await comparePassword(password, surveyor.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = JWT.sign({ _id: surveyor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: pwd, confirmPassword, ...sanitized } = surveyor._doc;

    res.status(200).json({ success: true, message: "Login successful", token, surveyor: sanitized });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// Get All Surveyors
const getAllSurveyors = async (req, res) => {
  try {
    console.log("📍 Reached getAllSurveyors");

    const test = await surveyorModel.findOne();
    console.log("✅ DB test passed, surveyor:", test);

    const surveyors = await surveyorModel
      .find()
      .select("-password -confirmPassword -__v")
      .sort({ createdAt: -1 });

    console.log("✅ Fetched surveyors:", surveyors.length);
    res.status(200).json({ success: true, data: surveyors });
  } catch (error) {
    console.error("❌ Detailed Error in getAllSurveyors:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch surveyors",
      error: error.message,
    });
  }
};

module.exports = {
  regController,
  logController,
  getAllSurveyors,
};
