import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const SALT_ROUNDS: number = parseInt(process.env.SALT!, 10);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const generateVerificationCode = (): string => {
  const code = randomBytes(3).toString("hex").toUpperCase();

  return code;
}