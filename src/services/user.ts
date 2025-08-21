import path from "path";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user";
import { UserCreationAttributes } from "../types/models";
import fs from "fs";

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