import { Router } from "express";
import * as userController from "../controllers/user";
import { validateId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get(":id/image", validateId, validationMiddleware, userController.getUserImage);

export default router;
