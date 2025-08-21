import { Request, Response } from "express";
import { changePassword as changePasswordService, forgotPasswordService, getImageById, resetPasswordService } from "../services/user";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";

export const getUserImage = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const filePath = await getImageById(id);
  res.sendFile(filePath);
})

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await forgotPasswordService(email);
  sendSuccessResponse(res, 200, result.message);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { code, newPassword } = req.body;
  const result = await resetPasswordService(code, newPassword);
  sendSuccessResponse(res, 200, result.message);
};

export const changePassword = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.id!;
    const { password, newPassword } = req.body;

    const result = await changePasswordService(userId, password, newPassword);
    sendSuccessResponse(res, 200, result.message);
  }
);