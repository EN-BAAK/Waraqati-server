import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { createRequest as createRequestService, workOnDemand as workOnDemandService, finishRequest as finishRequestService, cancelRequest as cancelRequestService, getClientRequests, getAvailableRequests as getAvailableRequestsService } from "../services/requests"
import { AuthenticatedMulterRequest, AuthenticatedRequest } from "../types/requests";

export const getAvailableRequests = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const requests = await getAvailableRequestsService(page, limit);

  const total = requests.count;
  const totalPages = Math.ceil(total / limit);

  return sendSuccessResponse(res, 200, "Requests found", {
    items: requests.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const getAuthenticatedClientRequests = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!;

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const requests = await getClientRequests(userId, page, limit);

  const total = requests.count;
  const totalPages = Math.ceil(total / limit);

  return sendSuccessResponse(res, 200, "Requests found", {
    items: requests.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const createRequest = catchAsyncErrors(async (req: AuthenticatedMulterRequest, res: Response) => {
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