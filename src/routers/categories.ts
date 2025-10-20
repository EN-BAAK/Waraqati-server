import { Router } from "express";
import * as categoryController from "../controllers/category";
import {
  createCategoryValidation,
  updateCategoryValidation,
  validateCategoryId,
  deleteCategoryValidation,
} from "../validations/category";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication, requireRole } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { uploadCategoryImage } from "../utils/multer";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/identifies", categoryController.getCategoriesIdentifies);
router.get("/:id/image", validateCategoryId, validationMiddleware, categoryController.getCategoryImage);
router.get("/:id", validateCategoryId, validationMiddleware, categoryController.getCategoryById);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadCategoryImage.fields([{ name: "image", maxCount: 1 }]), createCategoryValidation, validationMiddleware, categoryController.createCategory);

router.put("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadCategoryImage.fields([{ name: "image", maxCount: 1 }]), updateCategoryValidation, validationMiddleware, categoryController.updateCategory);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), deleteCategoryValidation, validationMiddleware, categoryController.deleteCategory);

export default router;
