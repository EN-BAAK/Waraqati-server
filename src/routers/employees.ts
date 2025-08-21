import { Router } from "express";
import * as employeeController from "../controllers/employees";
import { createEmployee_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get("/", validatePagination, validationMiddleware, employeeController.getEmployees);
router.get("/:userId", validateUserId, validationMiddleware, employeeController.getEmployeeByUserId);

router.post("/", createEmployee_UserValidation, validationMiddleware, employeeController.createEmployee);

export default router;
