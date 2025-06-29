import express from "express";
import {
  apiKey,
  login,
  profile,
  register,
} from "../controllers/auth.controller.js";
import { jwtLogin } from "../middlewares/auth.middleware.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const authRouter = express.Router();

// register route
authRouter.route("/register").post(userRegisterValidator(),validate,register);

// login route
authRouter.route("/login").post(userLoginValidator(),validate,login);

// apiKey route
authRouter.route("/api-key").post(jwtLogin, apiKey);

// profile route
authRouter.route("/me").get(jwtLogin, profile);

export default authRouter;
