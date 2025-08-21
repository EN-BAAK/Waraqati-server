import path from "path";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user";
import { UserCreationAttributes } from "../types/models";
import fs from "fs";
import Client from "../models/client.js";
import Employee from "../models/employee.js";

export const createUser = async (userData: UserCreationAttributes) => {
  const user = await User.create(userData);
  return user;
};

export const getImageById = async (id: number) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (!user.imgUrl) {
    throw new ErrorHandler("User does not have an image", 404);
  }

  const filePath = path.join(__dirname, "../uploads/users", user.imgUrl);

  if (!fs.existsSync(filePath)) {
    throw new ErrorHandler("Image not found", 404);
  }

  return filePath;
};

export const findUserByIdWithRole = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  const client = await Client.findOne({ where: { userId }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }], });
  if (client) {
    const json = client.toJSON() as any;
    return {
      ...json,
      id: json.user.id,
      user: undefined,
      ...json.user,
      role: "CLIENT",
    };
  }

  const employee = await Employee.findOne({ where: { userId }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }], });
  if (employee) {
    const json = employee.toJSON() as any;
    return {
      ...json,
      id: json.user.id,
      user: undefined,
      ...json.user,
      role: employee.isAdmin ? "ADMIN" : "EMPLOYEE",
    };
  }

  throw new ErrorHandler("Role not found for user", 403);
};