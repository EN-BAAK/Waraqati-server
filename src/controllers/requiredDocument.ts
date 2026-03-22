import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import {
  createRequiredDocument as createRequiredDocumentService,
  updateRequiredDocument as updateRequiredDocumentService,
  getRequiredDocuments as getRequiredDocumentsService,
  getRequiredDocumentById as getRequiredDocumentByIdService,
  deleteRequiredDocument as deleteRequiredDocumentService
} from "../services/requiredDocument";
import { sendSuccessResponse } from "../middlewares/success";

export const createRequiredDocument = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const doc = await createRequiredDocumentService(data);
  sendSuccessResponse(res, 201, "Document created Successfully", doc);
});

export const updateRequiredDocument = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const id = parseInt(req.params.id, 10);

  const doc = await updateRequiredDocumentService(id, data);
  sendSuccessResponse(res, 200, "Document updated Successfully", doc);
});

export const getRequiredDocuments = catchAsyncErrors(async (_: Request, res: Response) => {
  const docs = await getRequiredDocumentsService();
  sendSuccessResponse(res, 200, "Documents fetched successfully", docs);
});

export const getRequiredDocumentById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const doc = await getRequiredDocumentByIdService(id);
  sendSuccessResponse(res, 200, "Document fetched successfully", doc);
});

export const deleteRequiredDocument = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const result = await deleteRequiredDocumentService(id);
  sendSuccessResponse(res, 200, result.message);
});