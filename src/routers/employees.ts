import { Router } from "express";
import * as employeeController from "../controllers/employees";
import { createEmployee_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", verifyAuthentication, requireRole([ROLE.MANAGER]), validatePagination, validationMiddleware, employeeController.getEmployees);
router.get("/:userId", validateUserId, validationMiddleware, employeeController.getEmployeeByUserId);

router.post("/", createEmployee_UserValidation, validationMiddleware, employeeController.createEmployee);

export default router;
