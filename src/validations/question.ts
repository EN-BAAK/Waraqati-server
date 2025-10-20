import { body, param } from "express-validator";

export const createQuestionValidation = [
  body("question").notEmpty().withMessage("Question is required").isString().withMessage("Question must be a string"),
  body("answer").notEmpty().withMessage("Answer is required").isString().withMessage("Answer must be a string"),
  body("categoryId").optional().isInt({ min: 1 }).withMessage("CategoryId must be a positive integer"),
];

export const updateQuestionValidation = [
  param("id").isInt({ min: 1 }).withMessage("Question id must be a positive integer"),
  body("question").optional().isString().withMessage("Question must be a string"),
  body("answer").optional().isString().withMessage("Answer must be a string"),
  body("categoryId").optional().isInt({ min: 1 }).withMessage("CategoryId must be a positive integer"),
];

export const updateOrderValidation = [
  body("aQuestionId").notEmpty().isInt({ min: 1 }).withMessage("aQuestionId must be a positive integer"),
  body("bQuestionId").notEmpty().isInt({ min: 1 }).withMessage("bQuestionId must be a positive integer"),
];

export const toggleIsActiveValidation = [
  param("id").isInt({ min: 1 }).withMessage("Question id must be a positive integer"),
];

export const getQuestionByIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Question id must be a positive integer"),
];