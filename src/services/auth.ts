import { User } from "../models/user";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middlewares/error";
import { findUserByIdWithRole } from "./user";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import { sendEmail, verifyAccountMessage } from "../utils/mail";

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler("Invalid email or password", 401);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Invalid email or password", 401);

  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } });
  if (unverified) {
    await sendAccountVerificationMessage(user, unverified)
    throw new ErrorHandler("Please verify your account before logging in", 403);
  }

  const userInfo = await findUserByIdWithRole(user.id);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user: userInfo, token };
};

export const verifyService = async (userId: number) => {
  const userInfo = await findUserByIdWithRole(userId);
  return { ...userInfo };
};

export const sendAccountVerificationMessage = async (user: User, unverified: UnverifiedUser | undefined = undefined) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const code = generateVerificationCode()
  const msg = verifyAccountMessage(code)

  if (unverified) {
    unverified.code = code
    unverified.expire = expiresAt
    await unverified.save()
  } else {
    await UnverifiedUser.create({
      userId: user.id,
      code,
      expire: expiresAt,
    });
  }


  await sendEmail(user.email, msg)
}