import { Request, Response } from "express";
import * as serviceService from "../services/service";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getServices = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const title = req.query.title as string | undefined;

  const services = await serviceService.getAllServices(page, limit, title);

  const total = services.count;
  const totalPages = Math.ceil(total / limit);

  return sendSuccessResponse(res, 200, "Services found", {
    items: services.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const getServiceById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const service = await serviceService.getServiceById(id);

  return sendSuccessResponse(res, 200, "Service found", service);
});

export const deleteService = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  await serviceService.deleteService(id);

  return sendSuccessResponse(res, 200, "Service deleted successfully", { id });
});
