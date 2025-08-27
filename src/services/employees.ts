import { Employee } from "../models/employee";
import { User } from "../models/user";
import { EmployeeCreationAttributes } from "../types/models";
import { ROLE } from "../types/vars";

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
      role: ROLE.EMPLOYEE
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
    role: ROLE.EMPLOYEE
  };
};

export const createEmployee = async (data: EmployeeCreationAttributes) => {
  const employee = await Employee.create(data);
  const result = await getEmployeeByUserId(employee.id)
  return result
};