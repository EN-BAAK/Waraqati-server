import { param, body } from "express-validator";

export const userId = [
  param("userId").isInt({ min: 1 }).withMessage("User ID must be a positive integer"),
];

export const requestId = [
  param("requestId").isInt({ min: 1 }).withMessage("Request ID must be a positive integer"),
];

export const serviceId = [
  param("serviceId").isInt({ min: 1 }).withMessage("Service ID must be a positive integer"),
];

export const rateCreation = [
  ...requestId,
  body("rate").isInt({ min: 0, max: 5 }).withMessage("Rate must be an integer between 0 and 5"),
];