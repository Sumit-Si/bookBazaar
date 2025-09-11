import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be 3-20 characters"),

    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("FullName is required")
      .optional()
      .isLength({ min: 5, max: 100 })
      .withMessage("FullName must be 5-100 characters"),

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
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be at least 8 and max to 20 characters"),

    body("role")
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isLowercase()
      .withMessage("Role must be in lowercase")
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

const generateApiKeyValidator = () => {
  return [
    body("expiresAt")
      .optional()
      .trim()
      .isISO8601()
      .withMessage("ExpiresAt must be a valid ISO date"),
  ];
};

// book validations
const addBookValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be 3-100 characters"),

    body("description")
      .trim()
      .optional()
      .isLength({ min: 20, max: 1000 })
      .withMessage("Description must be 20-1000 characters"),

    body("author").trim().notEmpty().withMessage("Author is required"),

    body("genre")
      .trim()
      .notEmpty()
      .withMessage("Genre is required")
      .isLowercase()
      .withMessage("Genre must be in lowercase"),

    body("price").notEmpty().withMessage("Price is required"),

    body("stock").notEmpty().withMessage("Stock is required").default(0),

    body("ISBN")
      .trim()
      .notEmpty()
      .withMessage("ISBN is required")
      .isISBN(13)
      .withMessage("ISBN no. must be valid ISBN-13"),

    body("publisher").trim().optional(),

    body("publishedDate")
      .trim()
      .optional()
      .isISO8601()
      .withMessage("Published date must be a valid ISO date"),
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
      .trim()
      .notEmpty()
      .withMessage("Rating is required")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("Rating must be either 1,2,3,4 or 5")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),

    body("comment")
      .trim()
      .optional()
      .isLength({ min: 5, max: 120 })
      .withMessage("Comment must be 5-120 characters"),
  ];
};

// order validator
const addOrderValidator = () => {
  return [
    body("address")
      .notEmpty()
      .withMessage("Address is required")
      .trim()
      .isLength({ min: 8, max: 200 })
      .withMessage("Address must be 8-200 characters"),
  ];
};

// cart validator
const createCartValidator = () => {
  return [
    body("quantity")
      .trim()
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a number"),
  ];
};

const updateCartValidator = () => {
  return [
    body("quantity")
      .trim()
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a number"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  generateApiKeyValidator,
  addBookValidator,
  updateBookValidator,
  addReviewValidator,
  addOrderValidator,
  createCartValidator,
  updateCartValidator,
};
