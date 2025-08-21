import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be a string"),
];