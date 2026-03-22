import { param } from "express-validator";

export const validateDocumentId = [
  param("id").isInt({ min: 1 }).withMessage("Document ID must be a positive integer"),
];