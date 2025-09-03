import path from "path";
import ErrorHandler from "../middlewares/error";
import { User } from "../models/user";
import { UserCreationAttributes } from "../types/models";
import fs from "fs";
import { Client } from "../models/client";
import { Employee } from "../models/employee";
import { PasswordReset } from "../models/passwordReset";
import { resetEmailMessage, sendEmail, verifyAccountMessage } from "../utils/mail";
import { ROLE } from "../types/vars";
import { Manager } from "../models/manager";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import { MulterRequest } from "../types/requests";

export const createUser = async (userData: UserCreationAttributes, req: MulterRequest) => {
  if (req.files && "profileImage" in req.files) {
    userData.imgUrl = `/uploads/users/${req.files.profileImage[0].filename}`;
  }

  const user = await User.create(userData);
  return user;
};

export const getImageById = async (id: number) => {
  const user = await User.findByPk(id, { attributes: ["imgUrl"] });

  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (!user.imgUrl) {
    throw new ErrorHandler("User does not have an image", 404);
  }

  const filePath = path.join(process.cwd(), user.imgUrl);

  if (!fs.existsSync(filePath)) {
    throw new ErrorHandler("Image not found", 404);
  }

  return filePath;
};

export const findUserByIdWithRole = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);
  const checks: Record<ROLE, () => Promise<any>> = {
    CLIENT: () => Client.findOne({ where: { userId }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }] }),
    EMPLOYEE: () => Employee.findOne({ where: { userId, isAdmin: false }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }] }),
    ADMIN: () => Employee.findOne({ where: { userId, isAdmin: true }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }] }),
    MANAGER: () => Manager.findOne({ where: { userId }, include: [{ model: User, as: "user", attributes: { exclude: ["password", "imgUrl"] } }] }),
  };

  let foundRole: ROLE | null = null;
  let entity: any = null;

  for (const role of Object.keys(checks) as ROLE[]) {
    entity = await checks[role]();
    if (entity) {
      foundRole = role;
      break;
    }
  }

  if (!foundRole || !entity) {
    throw new ErrorHandler("User role not found", 404);
  }

  const json = entity.toJSON() as any;
  return {
    ...json,
    id: json.user.id,
    user: undefined,
    userId: undefined,
    ...json.user,
    createdAt: undefined,
    updatedAt: undefined,
    role: foundRole,
  };
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

  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } });
  if (unverified) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const code = generateVerificationCode()
    const msg = verifyAccountMessage(code)

    unverified.code = code
    unverified.expire = expiresAt
    await unverified.save()
    await sendEmail(user.email, msg)
    throw new ErrorHandler("Please verify your account before resetting the password", 403);
  }

  await cleanOldPasswordResets(user.id);

  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await PasswordReset.create({
    userId: user.id,
    code,
    expiresAt,
  });

  const msg = resetEmailMessage(code)
  await sendEmail(user.email, msg);

  return { message: "Reset code sent to email" };
};

export const resetForgottenPasswordService = async (code: string, newPassword: string) => {
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

export const updateUser = async (userId: number, userData: Partial<any>, req: MulterRequest) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  if (req.files && "profileImage" in req.files) {
    if (user.imgUrl) {
      const oldPath = path.join(process.cwd(), user.imgUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    user.imgUrl = `/uploads/users/${req.files.profileImage[0].filename}`;
  } else if ("profileImage" in userData && userData.profileImage === null) {
    if (user.imgUrl) {
      const oldPath = path.join(process.cwd(), user.imgUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    user.imgUrl = null;
  }

  const updatableFields = ["firstName", "middleName", "lastName", "email", "phone", "identityNumber"];

  updatableFields.forEach((field) => {
    if (field in userData && userData[field] !== undefined) {
      (user as any)[field] = userData[field];
    }
  });

  await user.save();
  return user;
};

export const deleteUserByIdService = async (userId: number) => {
  const user = await User.findByPk(userId)
  if (!user) throw new ErrorHandler("User not found", 404);

  user.destroy()
  return {message: "User deleted successfully"}
}