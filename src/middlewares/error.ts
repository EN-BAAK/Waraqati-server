import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { validationResult } from "express-validator";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const error: ErrorRequestHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid, Try again";
    err = new ErrorHandler(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Json web token is expired, Try again";
    err = new ErrorHandler(message, 401);
  }

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
      .slice(0, 2)
      .map((err: any) => err.message)
      .join(" ")
    : err.message;

  res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });

  return;
};

export const catchAsyncErrors = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};

export async function validationMiddleware(req: Request, _: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map(err => err.msg)
      .join(", ");

    return next(new ErrorHandler(message, 422))
  }

  next();
};

export default ErrorHandler;
