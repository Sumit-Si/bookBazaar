import express from "express";
import {
  checkAdmin,
  jwtLogin,
  verifyApiKey,
} from "../middlewares/auth.middleware.js";
import {
  addReview,
  deleteReview,
  getReviews,
} from "../controllers/review.controller.js";
import { addReviewValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const reviewRoutes = express.Router();

reviewRoutes
  .route("/books/:bookId/reviews")
  .post(jwtLogin, verifyApiKey,addReviewValidator(),validate, addReview)
  .get(jwtLogin, verifyApiKey, getReviews);

// delete review route
reviewRoutes
  .route("/reviews/:id")
  .delete(jwtLogin, checkAdmin, verifyApiKey, deleteReview);

export default reviewRoutes;
