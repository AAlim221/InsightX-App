// 📁 controllers/surveyorController.js
const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const surveyorModel = require("../models/surveyorModel");

// Register surveyor
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

    res.status(201).json({ success: true, message: "Surveyor registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error });
  }
};

// Login surveyor
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
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed", error });
  }
};

// Get all surveyors
const getAllSurveyors = async (req, res) => {
  try {
    const surveyors = await surveyorModel.find().select("-password -confirmPassword").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: surveyors });
  } catch (error) {
    console.error("Fetch Surveyors Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch surveyors", error });
  }
};

// Get single surveyor
const getSurveyorById = async (req, res) => {
  try {
    const surveyor = await surveyorModel.findById(req.params.id).select("-password -confirmPassword");
    if (!surveyor) return res.status(404).json({ success: false, message: "Surveyor not found" });
    res.json({ success: true, data: surveyor });
  } catch (err) {
    console.error("Get Surveyor Error:", err);
    res.status(500).json({ success: false, message: "Error fetching surveyor", error: err });
  }
};

// Update surveyor
const updateSurveyor = async (req, res) => {
  try {
    const updated = await surveyorModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password -confirmPassword");
    if (!updated) return res.status(404).json({ success: false, message: "Surveyor not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Surveyor Error:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err });
  }
};

// Delete surveyor
const deleteSurveyor = async (req, res) => {
  try {
    await surveyorModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Surveyor deleted" });
  } catch (err) {
    console.error("Delete Surveyor Error:", err);
    res.status(500).json({ success: false, message: "Delete failed", error: err });
  }
};

module.exports = {
  regController,
  logController,
  getAllSurveyors,
  getSurveyorById,
  updateSurveyor,
  deleteSurveyor,
};
