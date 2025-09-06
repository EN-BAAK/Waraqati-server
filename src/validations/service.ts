import { query, param } from "express-validator";

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100"),
  query("title").optional().isString().withMessage("Title should be string")
];

export const validateServiceId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

