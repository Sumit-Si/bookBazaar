import User from "../models/user.models.js";
import ApiKey from "../models/Api_key.models.js";
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

    const createdUser = await User.findById(user?._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        message: "Problem while creating user",
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
        error: "Invalid credientials",
      });
    }

    // check for password
    const isMatch = await user.isPasswordCorrect(password);
    console.log(isMatch ? "Yes" : "No");

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credientials",
      });
    }

    // create token
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRY,
    });

    const cookieOption = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const apiKey = async (req, res) => {
  try {
    const id = req.user?.id;

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

    const createdApiKey = await ApiKey.findById(apiKey?._id);

    if(!createdApiKey) {
      return res.status(500).json({
        message: "Problem while creating api key",
      })
    }

    res.status(201).json({
      success: true,
      message: "Api-key created successfully",
      apiKey,
    });
  } catch (error) {
    console.error("API key generation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const profile = async (req, res) => {
  const id = req.user?.id;
  console.log("userId", id);

  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export { register, login, apiKey, profile };
