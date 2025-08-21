import { query, param, body } from "express-validator";
import { SEX } from "../types/vars";

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100"),
];

export const validateUserId = [
  param("userId").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

export const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

const createUserValidation = [
  body("user.firstName")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string")
    .trim()
    .escape(),

  body("user.middleName")
    .optional()
    .isString().withMessage("Middle name must be a string")
    .trim()
    .escape(),

  body("user.lastName")
    .notEmpty().withMessage("Last name is required")
    .isString().withMessage("Last name must be a string")
    .trim()
    .escape(),

  body("user.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be valid")
    .normalizeEmail(),

  body("user.phone")
    .notEmpty().withMessage("Phone number is required")
    .isString().withMessage("Phone must be a string")
    .trim()
    .escape(),

  body("user.identityNumber")
    .notEmpty().withMessage("Identity number is required")
    .isString().withMessage("Identity number must be a string")
    .trim()
    .escape(),

  body("user.password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const createClientValidation = [
  body("client.country")
    .notEmpty().withMessage("Country is required")
    .isString().withMessage("Country must be a string")
    .trim()
    .escape(),

  body("client.age")
    .notEmpty().withMessage("Age is required")
    .isInt({ min: 18 }).withMessage("Age must be an integer and at least 18"),

  body("client.sex")
    .notEmpty().withMessage("Sex is required")
    .isIn(Object.values(SEX)).withMessage(`Sex must be one of: ${Object.values(SEX).join(", ")}`),

  body("client.creditor")
    .optional()
    .isFloat({ min: 0 }).withMessage("Creditor must be a positive number"),

  body("client.debit")
    .optional()
    .isFloat({ min: 0 }).withMessage("Debit must be a positive number"),

  body("client.isSpecial")
    .optional()
    .isBoolean().withMessage("isSpecial must be a boolean"),
];

export const createClient_UserValidation = [
  ...createUserValidation,
  ...createClientValidation
];

const createEmployeeValidation = [
  body("employee.rate")
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage("Rate must be a number between 0 and 5"),

  body("employee.isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable must be a boolean"),

  body("employee.isAdmin")
    .optional()
    .isBoolean().withMessage("isAdmin must be a boolean"),

  body("employee.creditor")
    .optional()
    .isFloat({ min: 0 }).withMessage("Creditor must be a positive number"),

  body("employee.debit")
    .optional()
    .isFloat({ min: 0 }).withMessage("Debit must be a positive number"),
];

export const createEmployee_UserValidation = [
  ...createUserValidation,
  ...createEmployeeValidation
];
