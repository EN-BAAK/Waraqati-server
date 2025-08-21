import { Request, Response } from "express";
import * as employeeService from "../services/employees";
import * as userService from "../services/user";
import ErrorHandler, { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getEmployees = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const employees = await employeeService.getEmployees(page, limit);

  return sendSuccessResponse(res, 200, "Employees have been found", {
    total: employees.count,
    page,
    pages: Math.ceil(employees.count / limit),
    data: employees.rows,
  })
})

export const getEmployeeByUserId = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10);
  const employee = await employeeService.getEmployeeById(id);

  if (!employee) throw new ErrorHandler("Employee not found", 404);
  return sendSuccessResponse(res, 200, "Employee has been found", { employee });
})

export const createEmployee = catchAsyncErrors(async (req: Request, res: Response) => {
  const { user, employee } = req.body;

  const newUser = await userService.createUser(user);
  const newEmployee = await employeeService.createEmployee({ ...employee, userId: newUser.id });

  return sendSuccessResponse(res, 201, "Employee created successfully", { employee: newEmployee });
});