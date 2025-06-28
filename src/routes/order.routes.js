import express from "express"
import { jwtLogin, verifyApiKey } from "../middlewares/auth.middleware.js";
import { addOrder, getOrders, orderDetails } from "../controllers/order.controller.js";

const orderRoutes = express.Router();

orderRoutes
    .route("/orders")
    .post(jwtLogin,verifyApiKey,addOrder)
    .get(jwtLogin,verifyApiKey,getOrders)


// order details route
orderRoutes
    .route("/orders/:id")
    .get(jwtLogin, verifyApiKey, orderDetails)

export default orderRoutes;