import { Router } from "express";
import { loginValidation } from "../validations/auth";
import { login, logout, verify } from "../controllers/auth";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication, verifyAuthenticationHeader } from "../middlewares/auth";

const router = Router();

router.get("/verify", verifyAuthentication, verify);
router.get("/verify-protected-middleware", verifyAuthenticationHeader, verify);

router.post("/login", loginValidation, validationMiddleware, login);
router.post("/logout", verifyAuthentication, logout);

export default router;
