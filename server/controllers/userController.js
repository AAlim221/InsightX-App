const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');

// Register
const registerController = async (req, res) => {
  try {
    const { userName, email, contactNo, DOB, password, role } = req.body;

    if (!userName || !email || !contactNo || !DOB || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await userModel.findOne({ userName });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User name already taken",
      });
    }

    const hashedPassword = await hashPassword(password);

    await new userModel({
      userName,
      email,
      contactNo,
      DOB,
      password: hashedPassword,
      role,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

// ✅ GET controller (defined outside loginController)
const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching user profile",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getUserProfileController,
};
