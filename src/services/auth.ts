import { User } from "../models/user";
import jwt from "jsonwebtoken";
import ErrorHandler from "../middlewares/error";
import { findUserByIdWithRole } from "./user";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import { sendEmail, verifyAccountMessage } from "../utils/mail";

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  console.log(1)
  if (!user) throw new ErrorHandler("Invalid email or password", 401);
  console.log(2)
  
  const isMatch = await user.checkPassword(password);
  console.log(3)
  if (!isMatch) throw new ErrorHandler("Invalid email or password", 401);
  console.log(4)
  
  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } });
  console.log(5)
  if (unverified) {
    console.log(6)
    await sendAccountVerificationMessage(user, unverified)
    console.log(7)
    throw new ErrorHandler("Please verify your account before logging in", 403);
  }
  console.log(8)
  
  const userInfo = await findUserByIdWithRole(user.id);
  console.log(9)

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