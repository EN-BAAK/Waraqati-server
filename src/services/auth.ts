import { User } from "../models/user";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middlewares/error";
import { findUserByIdWithRole } from "./user";

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler("Invalid email or password", 401);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Invalid email or password", 401);

  const userInfo = await findUserByIdWithRole(user.id);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user: userInfo, token };
};

export const verifyService = async (userId: number) => {
  const userInfo = await findUserByIdWithRole(userId);
  return { message: "verified", user: userInfo };
};

