import { Request } from 'express';
import { ROLE } from './vars';

export interface AuthenticatedRequest extends Request {
  id?: number,
  role?: ROLE;
}

export interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

export interface MulterRequest extends Request {
  files?: MulterFiles | Express.Multer.File[];
}