
import User from "../models/user.models.js";
import { randomBytes } from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "User not exists",
      });
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new Error(error?.message || "Problem while generating refresh and access tokens");
  }
};

const generateKey = () => {
  return randomBytes(32).toString("hex");
};

export { generateAccessAndRefreshToken, generateKey };
