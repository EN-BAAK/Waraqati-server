import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest } from "../types/requests";
import { getAllClientDocuments as getAllClientDocumentsService, downloadClientDocument as downloadClientDocumentService } from "../services/clientDocuments";
import { Response } from "express";

export const getAllClientDocuments = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id!;
  const labels = await getAllClientDocumentsService(userId);

  sendSuccessResponse(res, 200, "Documents fetched successfully", labels);
});

export const downloadClientDocument = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.id!;
    const docId = parseInt(req.params.id, 10);

    const filePath = await downloadClientDocumentService(userId, docId)

    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
      }
    });
  }
);