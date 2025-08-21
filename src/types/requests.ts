import { Request } from 'express';
import { ROLE } from './vars';

export interface AuthenticatedRequest extends Request {
  id?: number,
  role?: ROLE;
}