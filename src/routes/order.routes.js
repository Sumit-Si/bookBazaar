import express from "express";
import { jwtLogin, verifyApiKey } from "../middlewares/auth.middleware.js";
import {
  addOrder,
  getOrders,
  orderDetails,
} from "../controllers/order.controller.js";
import { addOrderValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const orderRoutes = express.Router();

orderRoutes
  .route("/")
  .post(
    jwtLogin,
    // verifyApiKey,
    addOrderValidator(),
    validate,
    addOrder,
  )
  .get(
    jwtLogin,
    // verifyApiKey,
    getOrders,
  );

// order details route
orderRoutes.route("/:id").get(
  jwtLogin,
  // verifyApiKey,
  orderDetails,
);

export default orderRoutes;
