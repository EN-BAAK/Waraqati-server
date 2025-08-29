import ErrorHandler from "../middlewares/error";
import { Employee } from "../models/employee";
import { User } from "../models/user";
import { EmployeeCreationAttributes } from "../types/models";
import { ROLE } from "../types/vars";
import { sendAccountVerificationMessage } from "./auth";

export const getEmployees = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Employee.findAndCountAll({
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
      },
    ],
    limit,
    offset,
  });

  const data = rows.map((employee) => {
    const json = employee.toJSON() as any;
    return {
      ...json,
      id: json.user.id,
      user: undefined,
      userId: undefined,
      createAt: undefined,
      updateAt: undefined,
      ...json.user,
      role: ROLE.EMPLOYEE,
      isVerified: !!json.user.isVerified
    };
  });

  return { count, rows: data };
};

export const getEmployeeByUserId = async (id: number) => {
  const employee = await Employee.findByPk(id, {
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
      },
    ],
  });

  if (!employee) return null;

  const json = employee.toJSON() as any;
  return {
    ...json,
    id: json.user.id,
    user: undefined,
    userId: undefined,
    ...json.user,
    createdAt: undefined,
    updatedAt: undefined,
    role: ROLE.EMPLOYEE,
    isVerified: !!json.user.isVerified
  };
};

export const createEmployee = async (data: EmployeeCreationAttributes) => {
  const employee = await Employee.create(data);
  const user = await User.findOne({ where: { id: employee.userId } })

  if (!user) {
    throw new ErrorHandler("Failed to send verify email, try to login to resend it, or delete the account by manager", 400)
  }

  sendAccountVerificationMessage(user)
  const result = await getEmployeeByUserId(employee.id)
  return result
};