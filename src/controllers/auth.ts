import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler, { catchAsyncErrors } from "../middlewares/error";
import * as authService from "../services/auth";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";

export const login = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginService(email, password);

  res.cookie(process.env.COOKIE_NAME!, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseInt(process.env.COOKIE_EXPIRE_MS!, 10)
  });

  sendSuccessResponse(res, 200, "Logged in successfully", user)
})

export const verify = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id

  if (!userId)
    return new ErrorHandler("Internal Server Error", 500)

  const result = await authService.verifyService(userId);
  sendSuccessResponse(res, 200, "Verified", result)
})

export const logout = catchAsyncErrors(async (req: Request, res: Response) => {
  const token = req.cookies?.[process.env.COOKIE_NAME!];
  if (token) {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (decoded?.exp) {
      addToBlacklist(token, decoded.exp);
    }
  }

  res.clearCookie(process.env.COOKIE_NAME!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendSuccessResponse(res, 200, "Logged out successfully");
});