import { param, body } from "express-validator";

export const validateCategoryId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

export const createCategoryValidation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim()
    .escape(),

  body("desc")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string")
    .trim()
    .escape(),
];

export const updateCategoryValidation = [
  ...validateCategoryId,
  body("title").optional().isString().withMessage("Title must be a string").trim().escape(),
  body("desc").optional().isString().withMessage("Description must be a string").trim().escape(),
];

export const deleteCategoryValidation = [
  ...validateCategoryId,
];
