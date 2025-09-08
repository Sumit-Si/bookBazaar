import express from "express";
import {
  apiKey,
  login,
  profile,
  register,
} from "../controllers/auth.controller.js";
import { jwtLogin } from "../middlewares/auth.middleware.js";
import {
  generateApiKeyValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const authRouter = express.Router();

// register route
authRouter.route("/register").post(upload.single("avatar"),userRegisterValidator(), validate, register);

// login route
authRouter.route("/login").post(userLoginValidator(), validate, login);

// apiKey route #TODO: middleware to check apiKey (optional)
authRouter.route("/api-key").post(jwtLogin,generateApiKeyValidator(),validate, apiKey);

// profile route
authRouter.route("/me").get(jwtLogin, profile);

export default authRouter;
