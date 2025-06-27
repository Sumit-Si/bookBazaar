import express from "express";
import { checkAdmin, jwtLogin, verifyApiKey } from "../middlewares/auth.middleware.js";
import { addBook, deleteBook, getBookById, getBooks, updateBookById } from "../controllers/book.controller.js";

const bookRoutes = express.Router();

// add book route
bookRoutes
  .route("/books")
  .post(jwtLogin, checkAdmin,verifyApiKey, addBook)
  .get(jwtLogin,verifyApiKey, getBooks);

// book by id route
bookRoutes
  .route("/books/:id")
  .get(jwtLogin,verifyApiKey,getBookById)
  .put(jwtLogin, checkAdmin,verifyApiKey,updateBookById)
  .delete(jwtLogin, checkAdmin,verifyApiKey,deleteBook);

export default bookRoutes;
