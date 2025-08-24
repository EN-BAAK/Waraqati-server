import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getManagerByUserId } from "../services/manager";

export const getManagerByUserIdController = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const manager = await getManagerByUserId(userId);

    if (!manager) {
      return sendSuccessResponse(res, 404, "Manager not found");
    }

    sendSuccessResponse(res, 200, "Manager fetched successfully", manager);
  }
);
