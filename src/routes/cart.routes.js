import express from "express";
import {isLoggedIn} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { addToCart, deleteCartItem, getCarts, updateCartItem } from "../controllers/cart.controller.js";
import { createCartValidator, updateCartValidator } from "../validators/index.js";

const cartRoutes = express.Router();

cartRoutes
    .route("/")
    .get(isLoggedIn,getCarts)
    .post(isLoggedIn,createCartValidator(),validate, addToCart);

cartRoutes
    .route("/:itemId")
    .put(isLoggedIn,updateCartValidator(),validate, updateCartItem)
    .delete(isLoggedIn, deleteCartItem)

export default cartRoutes;