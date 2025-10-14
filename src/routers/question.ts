import { Router } from "express";
import * as questionController from "../controllers/question";
import { validationMiddleware } from "../middlewares/error";
import {
  createQuestionValidation,
  updateQuestionValidation,
  updateOrderValidation,
  toggleIsActiveValidation
} from "../validations/question";

const router = Router();

router.get("/", questionController.getAllQuestions);
router.get("/active", questionController.getActiveQuestions);

router.post("/", createQuestionValidation, validationMiddleware, questionController.createQuestion);

router.put("/:id", updateQuestionValidation, validationMiddleware, questionController.updateQuestion);
router.put("/swap-order", updateOrderValidation, validationMiddleware, questionController.swapQuestionOrder);
router.put("/:id/toggle", toggleIsActiveValidation, validationMiddleware, questionController.toggleIsActive);

router.delete("/:id", updateQuestionValidation, validationMiddleware, questionController.deleteQuestion);

export default router;
