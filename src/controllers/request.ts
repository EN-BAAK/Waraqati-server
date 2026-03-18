import { Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { createRequest as createRequestService, workOnDemand as workOnDemandService, finishRequest as finishRequestService, cancelRequest as cancelRequestService } from "../services/requests"
import { AuthenticatedMulterRequest, AuthenticatedRequest } from "../types/requests";

export const createRequest = catchAsyncErrors(
  async (req: AuthenticatedMulterRequest, res: Response) => {
    const request = await createRequestService(req);
    return sendSuccessResponse(res, 201, "Request created", request);
  });

export const workOnDemand = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const employeeId = req.id!
  const request = await workOnDemandService(requestId, employeeId);

  return sendSuccessResponse(res, 200, "you received the request", request);
});

export const finishRequest = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const employeeId = req.id!;

  const request = await finishRequestService(requestId, employeeId);

  return sendSuccessResponse(res, 200, "Request finished", request);
});

export const cancelRequest = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const employeeId = req.id!;

  const request = await cancelRequestService(requestId, employeeId);

  return sendSuccessResponse(res, 200, "Request canceled", request);
});