import { Router } from "express";
import * as userController from "../controllers/user";
import { changePasswordValidation, forgotPasswordValidation, resetForgottenPasswordValidation, validateId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication } from "../middlewares/auth";

const router = Router();

router.get(":id/profile-image", validateId, validationMiddleware, userController.getUserImage);
router.get("/forgot-password/:email", forgotPasswordValidation, validationMiddleware, userController.forgotPassword);

router.put("/reset-forgotten-password", resetForgottenPasswordValidation, validationMiddleware, userController.resetForgottenPassword);
router.put("/change-password", verifyAuthentication, changePasswordValidation, validationMiddleware, userController.changePassword);


export default router;
