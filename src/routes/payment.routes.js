import express from "express";
import { jwtLogin } from "../middlewares/auth.middleware.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRoutes = express.Router();

paymentRoutes
    .route("/order")
    .post(jwtLogin,createRazorpayOrder);

paymentRoutes
    .route("/verify")
    .post(jwtLogin, verifyPayment);

export default paymentRoutes;