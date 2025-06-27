import User from "../models/user.models.js";
import ApiKey from "../models/Api_key.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const register = async (req, res) => {
  const { username, fullName, email, password, role } = req.body;

  console.log(req.body);

  try {
    // check user already exist
    const existingUser = await User.findOne({
      email,
    });

    console.log(existingUser, "existingUser");
    if (existingUser) {
      return res.status(400).json({
        error: "User already exist.",
      });
    }

    const user = await User.create({
      username,
      fullName,
      email,
      password,
      role,
    });

    if (!user) {
      return res.status(400).json({
        error: "User not created.",
      });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // find user by emailId
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid user",
      });
    }

    // check for password
    const isMatch = await user.isPasswordCorrect(password);
    console.log(isMatch ? "Yes" : "No");

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid user",
      });
    }

    // create token
    const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRY,
    });

    const cookieOption = {
      secure: false,
      httpOnly: true,
      sameSite: "lax", // Helps prevent CSRF (consider 'strict' or 'none' based on need)
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
      success: false,
    });
  }
};

const apiKey = async (req, res) => {
  try {
    const id = req?.user?.id;

    // check if user exist
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({
        error: "Invalid user",
      });
    }

    const generatedApiKey = await crypto.randomBytes(20).toString("hex");

    const apiKey = await ApiKey.create({
      user: user?._id,
      key: generatedApiKey,
    });

    if (!apiKey) {
      return res.status(400).json({
        error: "Key is not generated",
      });
    }

    await apiKey.save();

    res.status(201).json({
      success: true,
      message: "Api-key is successfully generated",
      apiKey: generatedApiKey,
    });
  } catch (error) {
    console.error("API key generation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const profile = async (req, res) => {
  const id = req?.user?.id;
  console.log("userId", id);

  const user = await User.findById(id).select(
    "-password -updatedAt -createdAt",
  );

  if (!user) {
    return res.status(400).json({
      error: "Invalid user",
    });
  }

  res.status(200).json({
    success: true,
    message: "Success",
    user,
  });
};

export { register, login, apiKey, profile };
