import { Request, Response, NextFunction } from "express";
import { getImageById } from "../services/user";

export const getUserImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const filePath = await getImageById(id);
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};
