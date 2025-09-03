import { Request, Response } from "express";
import * as employeeService from "../services/employees";
import * as userService from "../services/user";
import ErrorHandler, { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { unflatten } from "../utils/global";

export const getEmployees = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const employees = await employeeService.getEmployees(page, limit);

  const total = employees.count;
  const totalPages = Math.ceil(total / limit);

  return sendSuccessResponse(res, 200, "Employees have been found", {
    items: employees.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});

export const getEmployeeByUserId = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10);
  const employee = await employeeService.getEmployeeByUserId(id);

  if (!employee) throw new ErrorHandler("Employee not found", 404);
  return sendSuccessResponse(res, 200, "Employee has been found", employee);
})

export const createEmployee = catchAsyncErrors(async (req: Request, res: Response) => {
  const parse = unflatten(req.body);
  const { user, employee } = parse
  user.password = user.phone

  const newUser = await userService.createUser(user, req);
  const newEmployee = await employeeService.createEmployee({ ...employee, userId: newUser.id });

  return sendSuccessResponse(res, 201, "Employee created successfully", newEmployee);
});

export const updateEmployee = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    const parse = unflatten(req.body);
    const { user: userData, employee: employeeData } = parse;

    const updatedEmployee = await employeeService.updateEmployee(userId, userData || {}, employeeData || {}, req);
    return sendSuccessResponse(res, 200, "Employee updated successfully", updatedEmployee);
  }
);