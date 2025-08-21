import { Response } from 'express';

export function sendSuccessResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
