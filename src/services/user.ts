import path from "path";
import ErrorHandler from "../middlewares/error";
import { User } from "../models/user";
import { UserCreationAttributes } from "../types/models";
import fs from "fs";
import { Client } from "../models/client";
import { Employee } from "../models/employee";
import { randomBytes } from "crypto";
import { PasswordReset } from "../models/passwordReset";
import { sendResetEmail } from "../utils/mail";

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

export const cleanOldPasswordResets = async (userId: number) => {
  const now = new Date();

  const resets = await PasswordReset.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  for (const reset of resets) {
    if (reset.expiresAt < now) {
      await reset.destroy();
    }
  }

  const remaining = await PasswordReset.findAll({ where: { userId } });
  for (const r of remaining) {
    await r.destroy();
  }
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  await cleanOldPasswordResets(user.id);

  const code = randomBytes(3).toString("hex").toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordReset.create({
    userId: user.id,
    code,
    expiresAt,
  });

  await sendResetEmail(user.email, code);

  return { message: "Reset code sent to email" };
};

export const resetPasswordService = async (code: string, newPassword: string) => {
  const reset = await PasswordReset.findOne({ where: { code, isVerified: false } });
  if (!reset || reset.expiresAt < new Date()) throw new Error("Invalid or expired code");

  const user = await User.findByPk(reset.userId);
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  await user.save();

  reset.isVerified = true;
  await reset.save();

  return { message: "Password successfully reset" };
};

export const changePasswordService = async (
  userId: number,
  password: string,
  newPassword: string
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Current password is incorrect", 401);

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};
