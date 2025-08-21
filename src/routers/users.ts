import { Router } from "express";
import * as userController from "../controllers/user";
import { changePasswordValidation, forgotPasswordValidation, resetPasswordValidation, validateId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication } from "../middlewares/auth";

const router = Router();

router.get(":id/image", validateId, validationMiddleware, userController.getUserImage);

router.post("/forgot-password", forgotPasswordValidation, validationMiddleware, userController.forgotPassword);

router.put("/reset-password", resetPasswordValidation, validationMiddleware, userController.resetPassword);
router.put("/change-password", verifyAuthentication, changePasswordValidation, validationMiddleware, userController.changePassword);


export default router;
