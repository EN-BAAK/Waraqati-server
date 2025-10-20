import { Router } from "express";
import * as questionController from "../controllers/question";
import { validationMiddleware } from "../middlewares/error";
import {
  createQuestionValidation,
  updateQuestionValidation,
  updateOrderValidation,
  toggleIsActiveValidation,
  getQuestionByIdValidation
} from "../validations/question";

const router = Router();

router.get("/", questionController.getAllQuestions);
router.get("/active", questionController.getActiveQuestions);
router.get("/:id", getQuestionByIdValidation, validationMiddleware, questionController.getQuestionById);

router.post("/", createQuestionValidation, validationMiddleware, questionController.createQuestion);

router.put("/swap-order", updateOrderValidation, validationMiddleware, questionController.swapQuestionOrder);
router.put("/:id", updateQuestionValidation, validationMiddleware, questionController.updateQuestion);
router.put("/:id/toggle", toggleIsActiveValidation, validationMiddleware, questionController.toggleIsActive);

router.delete("/:id", updateQuestionValidation, validationMiddleware, questionController.deleteQuestion);

export default router;
