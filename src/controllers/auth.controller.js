import User from "../models/user.models.js";
import ApiKey from "../models/Api_key.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { generateAccessAndRefreshToken, generateKey } from "../utils/tokenGeneration.js";

const register = async (req, res) => {
  const { username, fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exist.",
      });
    }

    console.log(req.file, "req file");
    const avatarlocalPath = req.file?.path;

    if (!avatarlocalPath) {
      return res.status(400).json({
        message: "File is missing",
      });
    }

    let uploadResult;

    try {
      if (avatarlocalPath)
        uploadResult = await uploadOnCloudinary(avatarlocalPath);

      const user = await User.create({
        username,
        fullName,
        email,
        password,
        role,
        avatar: {
          url: uploadResult ? uploadResult?.url : null,
          localPath: avatarlocalPath || null,
        },
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
      if (uploadResult) await deleteFromCloudinary(uploadResult.public_id);
      res.status(500).json({
        success: false,
        message: "Problem while creating user",
        error: error.message,
      });
    }
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
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const cookieOption = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...cookieOption,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOption,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const apiKey = async (req, res) => {
  try {
    const id = req.user?._id;
    const {expiresAt} = req.body;

    // check if user exist
    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
      return res.status(400).json({
        error: "Unauthenticated",
      });
    }

    const generatedApiKey = generateKey();

    const apiKey = await ApiKey.create({
      user: user?._id,
      key: generatedApiKey,
      expiresAt,
    });

    const createdApiKey = await ApiKey.findById(apiKey?._id);

    if (!createdApiKey) {
      return res.status(500).json({
        message: "Problem while creating api key",
      });
    }

    res.status(201).json({
      success: true,
      message: "Api-key created successfully",
      createdApiKey,
    });
  } catch (error) {
    console.error("API key generation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const profile = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Success",
    user,
  });
};

export { register, login, apiKey, profile };
