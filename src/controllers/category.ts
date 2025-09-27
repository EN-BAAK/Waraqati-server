import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import {
  createCategoryService,
  deleteCategoryByIdService,
  getCategoryByIdService,
  getCategoriesService,
  getCategoryImageService,
  updateCategoryService,
} from "../services/category";
import { MulterRequest } from "../types/requests";

export const getCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const category = await getCategoryByIdService(id);
  sendSuccessResponse(res, 200, "Category fetched successfully", category);
});

export const getCategories = catchAsyncErrors(async (_: Request, res: Response) => {
  const categories = await getCategoriesService();
  sendSuccessResponse(res, 200, "Categories fetched successfully", categories);
});

export const getCategoryImage = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const filePath = await getCategoryImageService(id);
  res.sendFile(filePath);
});

export const createCategory = catchAsyncErrors(async (req: MulterRequest, res: Response) => {
  const result = await createCategoryService(req.body, req);
  sendSuccessResponse(res, 201, "Category created successfully", result);
});

export const updateCategory = catchAsyncErrors(async (req: MulterRequest, res: Response) => {
  const id = Number(req.params.id);
  const result = await updateCategoryService(id, req.body, req);
  sendSuccessResponse(res, 200, "Category updated successfully", result);
});

export const deleteCategory = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await deleteCategoryByIdService(id);
  sendSuccessResponse(res, 200, result.message);
});
