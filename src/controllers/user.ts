import { Request, Response, NextFunction } from "express";
import { getImageById } from "../services/user";
import { catchAsyncErrors } from "../middlewares/error";

export const getUserImage = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const filePath = await getImageById(id);
  res.sendFile(filePath);
})
