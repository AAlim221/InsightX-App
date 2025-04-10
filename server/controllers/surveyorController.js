const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const surveyorModel = require("../models/surveyorModel");

const registerController = async (req, res) => {
  try {
    const { name, gmail, password, confirmPassword, mobileNo, nidOrPassport } = req.body;

    if (!name || !gmail || !password || !confirmPassword || !mobileNo || !nidOrPassport) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await surveyorModel.findOne({ $or: [{ gmail }, { mobileNo }] });
    if (existing) {
      return res.status(400).json({ message: "Surveyor already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const surveyor = await new surveyorModel({
      name,
      gmail,
      password: hashedPassword,
      mobileNo,
      nidOrPassport,
      surveyorID: `SVY-${Date.now()}`
    }).save();

    return res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in register API", error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body; // frontend sends `email`

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const surveyor = await surveyorModel.findOne({ gmail: email });
    if (!surveyor) {
      return res.status(400).json({ message: "Surveyor not found" });
    }

    const match = await comparePassword(password, surveyor.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = JWT.sign({ _id: surveyor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    surveyor.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      surveyor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in login API", error });
  }
};

module.exports = { registerController, loginController };
