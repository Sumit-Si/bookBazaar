import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.models.js";
import ApiKey from "../models/Api_key.models.js";

dotenv.config();

const jwtLogin = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // check if exist
    if (!token) {
      return res.status(400).json({
        error: "Unauthenticated - Token not exist",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded data",decoded);
    
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
  }
};

const checkAdmin = async (req,res,next) => {
    try {
        const id = req.user?.id;

        if(!id) {
          return res.status(401).json({
            error: "User not authenticated"
          })
        }

        const user = await User.findById(id).select("-password");

        if(!user) { 
            return res.status(404).json({
                error: "User not found",
            })
        }

        if(user?.role !== "admin") {
            return res.status(403).json({
                error: "Only admin can create or update",
            })
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

const verifyApiKey = async (req,res,next) => {
    try {
        const apiKey = req.header("Authorization")?.replace("Bearer ", "");
        console.log("apiKey",apiKey);
        

        if(!apiKey) {
          return res.status(404).json({
            error: "Api key not found",
          })
        }

        const key = await ApiKey.findOne({
          key: apiKey,
        })
        console.log(key ? "found" : "Not found");

        if(!key) {
          return res.status(400).json({
            error: "Invalid Api key"
          })
        }
        
        next();
    } catch (error) {
        console.log(error);
    }
}

export { jwtLogin, verifyApiKey, checkAdmin };
