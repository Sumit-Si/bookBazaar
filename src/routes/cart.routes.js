import express from "express";
import {jwtLogin} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { addToCart, deleteCartItem, getCarts, updateCartItem } from "../controllers/cart.controller.js";
import { createCartValidator, updateCartValidator } from "../validators/index.js";

const cartRoutes = express.Router();

cartRoutes
    .route("/")
    .get(jwtLogin,getCarts)
    .post(jwtLogin,createCartValidator(),validate, addToCart);

cartRoutes
    .route("/:itemId")
    .put(jwtLogin,updateCartValidator(),validate, updateCartItem)
    .delete(jwtLogin, deleteCartItem)

export default cartRoutes;