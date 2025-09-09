import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.models.js";
import ApiKey from "../models/Api_key.models.js";

dotenv.config();

const jwtLogin = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    // check if exist
    if (!token) {
      return res.status(400).json({
        message: "Unauthenticated - Token not exist",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded data", decoded);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(400).json({
        message: "Unauthenticated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (user?.role !== "admin") {
      return res.status(403).json({
        error: "Only admin can create or update",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// #TODO: not completed yet!
const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header("Authorization")?.replace("Bearer ", "");
    console.log("apiKey", apiKey);

    if (!apiKey) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const key = await ApiKey.findOne({
      key: apiKey,
    });
    console.log(key ? "found" : "Not found");

    if (!key) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export { jwtLogin, verifyApiKey, checkAdmin };
