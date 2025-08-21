import { Router } from "express";
import { loginValidation } from "../validations/auth";
import { login, logout, verify } from "../controllers/auth";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get("/verify", verify);

router.post("/login", loginValidation, validationMiddleware, login);
router.post("/logout", logout);

export default router;
