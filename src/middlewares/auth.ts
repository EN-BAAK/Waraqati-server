import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ROLE } from '../types/vars';
import { AuthenticatedRequest } from '../types/requests';
import ErrorHandler, { catchAsyncErrors } from './error';
import User from '../models/user';
import Client from '../models/client';
import Employee from '../models/employee';

export const verifyAuthentication = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.[process.env.COOKIE_NAME!];

    if (!token)
      return next(new ErrorHandler('Unauthorized: Token not found', 401));

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    const user = await User.findByPk(payload.userId, { attributes: ['id'] });
    if (!user)
      return next(new ErrorHandler('User not found', 401));

    const userId = user.id;

    req.id = userId;

    const checks: Record<ROLE, () => Promise<boolean>> = {
      CLIENT: () =>
        Client.findOne({ where: { userId } }).then(Boolean),
      EMPLOYEE: () =>
        Employee.findOne({ where: { userId, isAdmin: false } }).then(Boolean),
      ADMIN: () =>
        Employee.findOne({ where: { userId, isAdmin: true } }).then(Boolean),
    };

    for (const role of Object.keys(checks) as ROLE[]) {
      const hasRole = await checks[role]();
      if (hasRole) {
        req.role = role;
        break;
      }
    }

    next();
  }
);

export const requireRole = (allowedRoles: ROLE[]) => {
  return catchAsyncErrors(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.id)
      return next(new ErrorHandler('User not loaded', 401));

    const role = req.role;

    const hasRole: boolean = role !== undefined && allowedRoles.includes(role)
    if (!hasRole)
      return next(new ErrorHandler('Forbidden: Insufficient permissions', 403));

    return next()
  })
};
