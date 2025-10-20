import { Category } from "../models/category";
import ErrorHandler from "../middlewares/error";
import { MulterRequest } from "../types/requests";
import path from "path";
import fs from "fs";
import { CategoryCreationAttributes } from "../types/models";

export const getCategoriesService = async () => {
  return Category.findAll({
    attributes: ["id", "title", "desc"],
    order: [["id", "DESC"]],
  });
};

export const getCategoryByIdService = async (id: number) => {
  return Category.findByPk(id, {
    attributes: ["id", "title", "desc"],
  });
};

export const getCategoryImageService = async (id: number) => {
  const category = await Category.findByPk(id, { attributes: ["imgUrl"] });
  if (!category) throw new ErrorHandler("Category not found", 404);
  if (!category.imgUrl) throw new ErrorHandler("Category does not have an image", 404);

  const filePath = path.join(process.cwd(), category.imgUrl);
  if (!fs.existsSync(filePath)) throw new ErrorHandler("Image not found", 404);
  return filePath;
};

export const createCategoryService = async (
  data: CategoryCreationAttributes,
  req: MulterRequest
) => {
  if (req.files && "image" in req.files) {
    data.imgUrl = `/uploads/categories/${req.files.image[0].filename}`;
  }

  const category = await Category.create(data)
  return category;
};

export const updateCategoryService = async (
  id: number,
  data: Partial<CategoryCreationAttributes>,
  req: MulterRequest
) => {
  const category = await Category.findByPk(id);
  if (!category) throw new ErrorHandler("Category not found", 404);

  if (req.files && "image" in req.files) {
    if (category.imgUrl) {
      const oldPath = path.join(process.cwd(), category.imgUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    category.imgUrl = `/uploads/categories/${req.files.image[0].filename}`;
  } else if ("imgUrl" in data && data.imgUrl === "null") {
    if (category.imgUrl) {
      const oldPath = path.join(process.cwd(), category.imgUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    category.imgUrl = null;
  }

  if (data.title !== undefined) category.title = data.title;
  if (data.desc !== undefined) category.desc = data.desc;

  await category.save();
  return category;
};

export const deleteCategoryByIdService = async (id: number) => {
  const category = await Category.findByPk(id);
  if (!category) throw new ErrorHandler("Category not found", 404);

  await category.destroy();
  return { message: "Category deleted successfully" };
};

export const getCategoriesIdentifiesService = async () => {
  return Category.findAll({
    attributes: ["id", "title"],
    order: [["id", "ASC"]],
  });
};
