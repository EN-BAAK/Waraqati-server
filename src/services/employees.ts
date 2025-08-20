import Employee from "../models/employee";
import User from "../models/user";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../types/models";

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
      ...json.user,
    };
  });

  return { count, rows: data };
};

export const getEmployeeById = async (id: number) => {
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
    ...json.user,
  };
};

export const createEmployee = async (data: EmployeeCreationAttributes) => {
  const employee = await Employee.create(data);
  const result = await getEmployeeById(employee.id)
  return result
};