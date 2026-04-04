import { param, query, body } from "express-validator";
import { REQUESTS_STATE } from "../types/vars";

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
]

export const validateAdminEmployeeTransition = [
  ...RequestId,
  body("state")
    .isString()
    .isIn([REQUESTS_STATE.CANCELED, REQUESTS_STATE.IN_PROGRESS, REQUESTS_STATE.FINISHED, REQUESTS_STATE.IN_HOLD, REQUESTS_STATE.IN_QUEUE])
    .withMessage("Invalid nextState for employee transition"),
];
6
export const validateManagerTransition = [
  ...RequestId,
  body("state")
    .isString()
    .isIn([REQUESTS_STATE.IN_QUEUE, REQUESTS_STATE.REVIEWED, REQUESTS_STATE.SUCCEED, REQUESTS_STATE.CANCELED, REQUESTS_STATE.IN_QUEUE])
    .withMessage("Invalid nextState for manager transition"),
];

export const FullFilteredRequests = [
  ...validatePagination,
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
  query("state")
    .optional()
    .isString()
    .withMessage("State must be a string"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
];

export const ServiceIdParam = [
  param("serviceId")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer"),
];

export const AvailableRequestsValidation = [
  ...validatePagination,
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be a string"),
  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),
];