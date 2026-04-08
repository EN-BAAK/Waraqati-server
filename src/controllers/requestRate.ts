import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getEmployeeRatings as getEmployeeRatingsService, getServiceRatings as getRequestRatingsService, rateRequest as rateRequestService, getClientRating as getClientRatingService } from "../services/requestRate";
import { AuthenticatedRequest } from "../types/requests";
import { ROLE } from "../types/vars";

export const getEmployeeRatings = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const result = await getEmployeeRatingsService(userId);
  return sendSuccessResponse(res, 200, "Employee ratings fetched", result);
});

export const getServiceRatings = catchAsyncErrors(async (req: Request, res: Response) => {
  const serviceId = parseInt(req.params.serviceId, 10);
  const result = await getRequestRatingsService(serviceId);
  return sendSuccessResponse(res, 200, "Request ratings fetched", result);
});

export const rateRequest = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  if (req.role !== ROLE.CLIENT) throw new Error("Only clients can rate requests");
  const requestId = parseInt(req.params.requestId, 10);
  const { rate } = req.body;
  const userId = req.id!;
  const result = await rateRequestService(requestId, userId, rate);
  return sendSuccessResponse(res, 200, "Request rated", result);
});

export const getClientRating = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId, 10);
  const userId = req.id!;
  const result = await getClientRatingService(requestId, userId);
  return sendSuccessResponse(res, 200, "Rating fetched", result);
});
