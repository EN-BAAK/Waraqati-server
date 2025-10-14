import { Request, Response } from "express";
import * as questionService from "../services/question";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getAllQuestions = catchAsyncErrors(async (req: Request, res: Response) => {
  const questions = await questionService.getAllQuestions();
  sendSuccessResponse(res, 200, "All questions retrieved", questions);
});

export const getActiveQuestions = catchAsyncErrors(async (req: Request, res: Response) => {
  const questions = await questionService.getActiveQuestions();
  sendSuccessResponse(res, 200, "Active questions retrieved", questions);
});

export const createQuestion = catchAsyncErrors(async (req: Request, res: Response) => {
  const question = await questionService.createQuestion(req.body);
  sendSuccessResponse(res, 201, "Question created successfully", question);
});

export const updateQuestion = catchAsyncErrors(async (req: Request, res: Response) => {
  const question = await questionService.updateQuestion(parseInt(req.params.id), req.body);
  sendSuccessResponse(res, 200, "Question updated successfully", question);
});

export const deleteQuestion = catchAsyncErrors(async (req: Request, res: Response) => {
  const result = await questionService.deleteQuestion(parseInt(req.params.id));
  sendSuccessResponse(res, 200, "Question deleted successfully", result);
});

export const swapQuestionOrder = catchAsyncErrors(async (req: Request, res: Response) => {
  const { aQuestionId, bQuestionId } = req.body;
  const result = await questionService.swapQuestionOrder(aQuestionId, bQuestionId);
  sendSuccessResponse(res, 200, "Questions order swapped", result);
});

export const toggleIsActive = catchAsyncErrors(async (req: Request, res: Response) => {
  const question = await questionService.toggleIsActive(parseInt(req.params.id));
  sendSuccessResponse(res, 200, "Question isActive toggled", question);
});
