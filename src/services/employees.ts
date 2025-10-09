import { Op } from "sequelize";
import ErrorHandler from "../middlewares/error";
import { Employee } from "../models/employee";
import { UnverifiedUser } from "../models/unverifiedUser";
import { User } from "../models/user";
import { EmployeeCreationAttributes } from "../types/models";
import { ROLE } from "../types/vars";
import { sendAccountVerificationMessage } from "./auth";

export const getEmployees = async (page: number, limit: number, search?: string) => {
  const offset = (page - 1) * limit;

  const userWhere: any = {};
  if (search) {
    userWhere[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      {
        [Op.and]: [
          { firstName: { [Op.like]: `%${search.split(" ")[0]}%` } },
          { lastName: { [Op.like]: `%${search.split(" ")[1] || ""}%` } },
        ]
      }
    ];
  }

  const { count, rows } = await Employee.findAndCountAll({
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        where: userWhere,
        attributes: { exclude: ["password", "imgUrl"] },
        include: [
          {
            model: UnverifiedUser,
            as: "unverified",
            attributes: ["id"],
          },
        ],
      },
    ],
    limit,
    offset,
    order: [[{ model: User, as: "user" }, "createdAt", "DESC"]],
  });

  const data = rows.map((employee) => {
    const json = employee.toJSON() as any;

    return {
      ...json,
      id: json.user.id,
      user: undefined,
      userId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...json.user,
      role: ROLE.EMPLOYEE,
      unverified: undefined,
      isVerified: !json.user.unverified,
    };
  });

  return { count, rows: data };
};

export const getEmployeeByUserId = async (id: number) => {
  const employee = await Employee.findOne({
    where: { userId: id },
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
        include: [
          {
            model: UnverifiedUser,
            as: "unverified",
            attributes: ["id"],
          },
        ],
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
    unverified: undefined,
    isVerified: !json.user.unverified,
  };
};

export const createEmployee = async (data: EmployeeCreationAttributes) => {
  const employee = await Employee.create(data);
  const user = await User.findOne({ where: { id: employee.userId } })

  if (!user) {
    throw new ErrorHandler("Failed to send verify email, try to login to resend it, or delete the account by manager", 400)
  }

  await sendAccountVerificationMessage(user)
  const result = await getEmployeeByUserId(user.id)
  return result
};

export const updateEmployee = async (
  userId: number,
  employeeData: Partial<any>,
) => {
  const employee = await Employee.findOne({ where: { userId } });
  if (!employee) throw new ErrorHandler("Employee not found", 404);

  const updatableFields: (keyof Employee)[] = ["rate", "isAvailable", "isAdmin", "creditor", "debit"];
  (updatableFields as (keyof Employee)[]).forEach((field) => {
    if (field in employeeData && employeeData[field] !== undefined) {
      (employee as any)[field] = employeeData[field];
    }
  });

  await employee.save();

  return getEmployeeByUserId(userId);
};