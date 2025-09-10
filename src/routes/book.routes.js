import express from "express";
import {
  checkAdmin,
  jwtLogin,
  verifyApiKey,
} from "../middlewares/auth.middleware.js";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBookById,
} from "../controllers/book.controller.js";
import { addBookValidator, updateBookValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const bookRoutes = express.Router();

bookRoutes
  .route("/")
  .post(
    jwtLogin,
    checkAdmin,
    upload.single("coverImage"),
    // verifyApiKey,
    addBookValidator(),
    validate,
    addBook,
  )
  .get(getBooks);

bookRoutes
  .route("/:id")
  .get(jwtLogin, getBookById)
  .put(jwtLogin, checkAdmin, updateBookValidator(), validate, updateBookById)
  .delete(jwtLogin, checkAdmin, deleteBook);

export default bookRoutes;
