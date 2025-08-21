import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middlewares/error";
import * as authService from "../services/auth";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginService(email, password);

    res.cookie(process.env.COOKIE_NAME!, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME!];
    if (!token) throw new ErrorHandler("Unauthorized: Token not found", 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    if (!payload?.userId) throw new ErrorHandler("Invalid token", 401);

    const result = await authService.verifyService(payload.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
