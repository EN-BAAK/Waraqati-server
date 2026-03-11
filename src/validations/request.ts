import { param } from "express-validator";

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