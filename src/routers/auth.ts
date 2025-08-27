import { Router } from "express";
import { loginValidation } from "../validations/auth";
import { login, logout, verify } from "../controllers/auth";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication } from "../middlewares/auth";

const router = Router();

router.get("/verify", verifyAuthentication, verify);

router.post("/login", loginValidation, validationMiddleware, login);
router.post("/logout", verifyAuthentication, logout);

export default router;
