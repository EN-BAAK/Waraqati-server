import { Router } from "express";
import * as employeeController from "../controllers/employees";
import { createEmployee_UserValidation, updateEmployee_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { uploadProfile } from "../utils/multer";

const router = Router();

router.get("/", verifyAuthentication, requireRole([ROLE.MANAGER]), validatePagination, validationMiddleware, employeeController.getEmployees);
router.get("/:userId", verifyAuthentication, requireRole([ROLE.MANAGER]), validateUserId, validationMiddleware, employeeController.getEmployeeByUserId);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadProfile.fields([{ name: "profileImage", maxCount: 1 }]), createEmployee_UserValidation, validationMiddleware, employeeController.createEmployee);
router.put("/:userId", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadProfile.fields([{ name: "profileImage", maxCount: 1 }]), updateEmployee_UserValidation, validationMiddleware, employeeController.updateEmployee);

export default router;
