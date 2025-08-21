import { Router } from "express";
import * as userController from "../controllers/user";
import { forgotPasswordValidation, resetPasswordValidation, validateId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get(":id/image", validateId, validationMiddleware, userController.getUserImage);

router.post("/forgot-password", forgotPasswordValidation, validationMiddleware, userController.forgotPassword);
router.post("/reset-password", resetPasswordValidation, validationMiddleware, userController.resetPassword);

export default router;
