import { param, query } from "express-validator";

export const ServiceIdParam = [
  param("serviceId")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer"),
];

export const RequestId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Request ID must be a positive integer"),
];

export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];