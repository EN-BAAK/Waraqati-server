import { Router } from "express";
import { getManagerByUserIdController } from "../controllers/manager";
import { validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get("/user/:userId", validateUserId, validationMiddleware, getManagerByUserIdController);

export default router;
