import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { createRequest as createRequestService, inHoldTransaction, cancelRequest as cancelRequestService, getClientRequests, getAvailableRequests as getAvailableRequestsService, getEmployeeRequests as getEmployeeRequestsService, cancelRequestTransition, inProgressTransition, finishTransition, reviewOrSucceedTransition, moveToQueueFromCanceled, quittingRequest } from "../services/requests"
import { AuthenticatedMulterRequest, AuthenticatedRequest } from "../types/requests";
import { REQUESTS_STATE } from "../types/vars";

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

export const getEmployeeRequests = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const search = req.query.search as string | undefined;
  const state = req.query.state as string | undefined;
  const category = req.query.category as string | undefined;

  const requests = await getEmployeeRequestsService({ userId, page, limit, search, state, category });

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

export const handleAdminEmployeeTransition = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { state } = req.body;
  const userId = req.id!;

  let result;
  switch (state) {
    case REQUESTS_STATE.CANCELED:
      result = await cancelRequestTransition(id, userId);
      break;
    case REQUESTS_STATE.IN_PROGRESS:
      result = await inProgressTransition(id, userId);
      break;
    case REQUESTS_STATE.FINISHED:
      result = await finishTransition(id, userId);
      break;
    case REQUESTS_STATE.IN_HOLD:
      result = await inHoldTransaction(id, userId)
      break;
    case REQUESTS_STATE.IN_QUEUE:
      result = await quittingRequest(id, userId)
      break;
    default:
      throw new Error("Invalid next state for admin/employee");
  }

  return sendSuccessResponse(res, 200, "Request state updated", result);
});

export const handleManagerTransition = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { state } = req.body;

  let result;
  switch (state) {
    case "reviewed":
      result = await reviewOrSucceedTransition(id, state);
      break;
    case "succeed":
      result = await reviewOrSucceedTransition(id, state);
      break;
    case "queue":
      result = await moveToQueueFromCanceled(id);
      break;
    default:
      throw new Error("Invalid next state for manager");
  }
  return sendSuccessResponse(res, 200, "Request state updated", result);
});

export const cancelRequest = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const requestId = parseInt(req.params.requestId);
  const employeeId = req.id!;

  const request = await cancelRequestService(requestId, employeeId);

  return sendSuccessResponse(res, 200, "Request canceled", request);
});