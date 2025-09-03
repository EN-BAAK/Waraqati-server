import { Request, Response } from "express";
import { changePasswordService, deleteUserByIdService, forgotPasswordService, getImageById, resetForgottenPasswordService } from "../services/user";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";
import { User } from "../models/user";

export const getUserImage = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const filePath = await getImageById(id);
  res.sendFile(filePath);
})

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await forgotPasswordService(email);
  sendSuccessResponse(res, 200, result.message);
};

export const resetForgottenPassword = async (req: Request, res: Response) => {
  const { code, password } = req.body;
  const result = await resetForgottenPasswordService(code, password);
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

export const deleteUserById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const result = await deleteUserByIdService(id)

  sendSuccessResponse(res, 200, result.message)
})

export const createUser = catchAsyncErrors(async (req: Request, res: Response) => {
  const user = User.create(req.body)
  sendSuccessResponse(res, 200, "Created", user)
})