import { Router } from "express";
import * as questionController from "../controllers/question";
import { validationMiddleware } from "../middlewares/error";
import { createQuestionValidation, updateQuestionValidation, updateOrderValidation, toggleIsActiveValidation, getQuestionByIdValidation } from "../validations/question";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", questionController.getAllQuestions);
router.get("/active", questionController.getActiveQuestions);
router.get("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), getQuestionByIdValidation, validationMiddleware, questionController.getQuestionById);

router.post("/", verifyAuthentication, requireRole([ROLE.ADMIN]), createQuestionValidation, validationMiddleware, questionController.createQuestion);

router.put("/swap-order", verifyAuthentication, requireRole([ROLE.ADMIN]), updateOrderValidation, validationMiddleware, questionController.swapQuestionOrder);
router.put("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), updateQuestionValidation, validationMiddleware, questionController.updateQuestion);
router.put("/:id/toggle", verifyAuthentication, requireRole([ROLE.ADMIN]), toggleIsActiveValidation, validationMiddleware, questionController.toggleIsActive);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), updateQuestionValidation, validationMiddleware, questionController.deleteQuestion);

export default router;
