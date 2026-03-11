import { Router } from "express";
import * as questionController from "../controllers/question";
import { validationMiddleware } from "../middlewares/error";
import { createQuestionValidation, updateQuestionValidation, updateOrderValidation, toggleIsActiveValidation, getQuestionByIdValidation } from "../validations/question";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", questionController.getAllQuestions);
router.get("/active", questionController.getActiveQuestions);
router.get("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), getQuestionByIdValidation, validationMiddleware, questionController.getQuestionById);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), createQuestionValidation, validationMiddleware, questionController.createQuestion);

router.put("/swap-order", verifyAuthentication, requireRole([ROLE.MANAGER]), updateOrderValidation, validationMiddleware, questionController.swapQuestionOrder);
router.put("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), updateQuestionValidation, validationMiddleware, questionController.updateQuestion);
router.put("/:id/toggle", verifyAuthentication, requireRole([ROLE.MANAGER]), toggleIsActiveValidation, validationMiddleware, questionController.toggleIsActive);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), updateQuestionValidation, validationMiddleware, questionController.deleteQuestion);

export default router;
