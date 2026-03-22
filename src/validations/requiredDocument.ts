import { param, body } from "express-validator";

export const validateRequiredDocumentId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

export const createRequiredDocumentValidation = [
  body("label").notEmpty().withMessage("Label is required").isString().withMessage("Label must be a string").trim().escape(),
];

export const updateRequiredDocumentValidation = [
  ...validateRequiredDocumentId,
  body("label").optional().isString().withMessage("Label must be a string").trim().escape(),
];

export const deleteRequiredDocumentValidation = [
  ...validateRequiredDocumentId,
];