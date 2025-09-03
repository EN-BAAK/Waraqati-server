import { Router } from "express";
import * as userController from "../controllers/user";
import { changePasswordValidation, forgotPasswordValidation, resetForgottenPasswordValidation, validateId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/:id/profile-image", verifyAuthentication, validateId, validationMiddleware, userController.getUserImage);
router.get("/forgot-password/:email", forgotPasswordValidation, validationMiddleware, userController.forgotPassword);

router.put("/reset-forgotten-password", resetForgottenPasswordValidation, validationMiddleware, userController.resetForgottenPassword);
router.put("/change-password", verifyAuthentication, changePasswordValidation, validationMiddleware, userController.changePassword);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), validateId, validationMiddleware, userController.deleteUserById);

router.post("/", userController.createUser);


export default router;
