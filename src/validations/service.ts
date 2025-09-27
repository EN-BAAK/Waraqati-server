import { query, param, body } from "express-validator";
import { QUESTION_TYPE } from "../types/vars";

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1–100"),
  query("title").optional().isString().withMessage("Title should be string")
];

export const validateServiceId = [
  param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
];

export const createServiceValidation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim()
    .escape(),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string"),

  body("duration")
    .notEmpty().withMessage("Duration is required")
    .isString().withMessage("Duration must be a string"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("questions")
    .optional()
    .isArray().withMessage("Questions must be an array"),

  body("questions.*.question")
    .optional()
    .notEmpty().withMessage("Each question must have text")
    .isString().withMessage("Question must be a string"),

  body("questions.*.type")
    .optional()
    .notEmpty().withMessage("Question type is required")
    .isIn(Object.values(QUESTION_TYPE)).withMessage(
      `Type must be one of: ${Object.values(QUESTION_TYPE).join(", ")}`
    ),

  body("questions.*.choices")
    .optional()
    .custom((value, { req, path }) => {
      const index = Number(path.match(/\d+/)?.[0]);
      const type = req.body.questions?.[index]?.type;

      if (type === QUESTION_TYPE.MultiChoice) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Choices are required for multichoice questions");
        }
      }
      return true;
    }),

  body("requiredDocs")
    .optional()
    .isArray().withMessage("requiredDocs must be an array"),

  body("requiredDocs.*.label")
    .optional()
    .notEmpty().withMessage("Each requiredDoc must be a non-empty string")
    .isString().withMessage("Each requiredDoc must be a string")
    .trim()
    .escape(),

  body("requiredDocs.*.state")
    .optional()
    .notEmpty().withMessage("State is required")
    .isIn(["exists", "new"]).withMessage("State must be either 'exists' or 'new'"),
];

export const updateServiceValidation = [
  ...validateServiceId,

  body("title")
    .optional()
    .isString().withMessage("Title must be a string")
    .trim()
    .escape(),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string"),

  body("duration")
    .optional()
    .isString().withMessage("Duration must be a string"),

  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("questions")
    .optional()
    .isArray().withMessage("Questions must be an array"),

  body("questions.*.question")
    .optional()
    .notEmpty().withMessage("Each question must have text")
    .isString().withMessage("Question must be a string"),

  body("questions.*.type")
    .optional()
    .notEmpty().withMessage("Question type is required")
    .isIn(Object.values(QUESTION_TYPE)).withMessage(
      `Type must be one of: ${Object.values(QUESTION_TYPE).join(", ")}`
    ),

  body("questions.*.choices")
    .optional()
    .custom((value, { req, path }) => {
      const index = Number(path.match(/\d+/)?.[0]);
      const type = req.body.questions?.[index]?.type;

      if (type === QUESTION_TYPE.MultiChoice) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Choices are required for multichoice questions");
        }
      }
      return true;
    }),

  body("requiredDocs")
    .optional()
    .isArray().withMessage("requiredDocs must be an array"),

  body("requiredDocs.*.label")
    .optional()
    .notEmpty().withMessage("Each requiredDoc must be a non-empty string")
    .isString().withMessage("Each requiredDoc must be a string")
    .trim()
    .escape(),

  body("requiredDocs.*.state")
    .optional()
    .notEmpty().withMessage("State is required")
    .isIn(["exists", "new", "deleted"]).withMessage("State must be either 'exists', 'new' or 'deleted'"),
];
