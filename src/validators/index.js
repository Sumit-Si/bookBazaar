import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("FullName is required")
      .optional(),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 15 })
      .withMessage("Password must be at least 6 and max to 15 characters"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["user", "admin"])
      .withMessage("Role is invalid"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

// title, description, author, genre, price, stock
// book validations
const addBookValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("author")
      .trim()
      .notEmpty()
      .withMessage("Author is required")
      .isLength({ min: 3 })
      .withMessage("Author name must be at least 3 characters long"),

    body("genre").trim().notEmpty().withMessage("Genre is required"),

    body("price").notEmpty().withMessage("Price is required"),

    body("stock").notEmpty().withMessage("Stock is required").default(0),
  ];
};

const updateBookValidator = () => {
  return [
    body("title").optional(),
    body("description").optional(),
    body("author").optional(),
    body("price").optional(),
    body("stock").optional(),
  ];
};

// review validator
const addReviewValidator = () => {
  return [
    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isNumeric()
      .withMessage("Rating must be in numeric")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),

    body("comment").trim().notEmpty().withMessage("Comment is required"),
  ];
};

// order validator
const addOrderValidator = () => {
  return [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must be a non-empty array"),

    body("items.*.book").trim().notEmpty().withMessage("Book id is required"),

    body("items.*.quantity").notEmpty().withMessage("Quantity is required").isInt({ min: 1 }).withMessage("Quantity must be numeric"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  addBookValidator,
  updateBookValidator,
  addReviewValidator,
  addOrderValidator
};
