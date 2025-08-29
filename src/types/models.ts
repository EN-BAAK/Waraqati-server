import { Optional } from "sequelize";
import { SEX } from "./vars";

export interface UserAttributes {
  id: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone: string;
  identityNumber: string;
  password: string;
  imgUrl?: string | null,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "middleName"> { }

export interface EmployeeAttributes {
  id: number;
  userId: number;
  rate: number;
  isAvailable: boolean;
  isAdmin: boolean;
  creditor: number;
  debit: number;
}

export interface EmployeeCreationAttributes extends Omit<EmployeeAttributes, "id"> { }

export interface ClientAttributes {
  id: number;
  userId: number;
  country: string;
  age: number;
  sex: SEX;
  creditor: number;
  debit: number;
  isSpecial: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientCreationAttributes extends Omit<ClientAttributes, "id"> { }

export interface PasswordResetAttributes {
  id?: number;
  userId: number;
  code: string;
  expiresAt: Date;
  isVerified: boolean;
}

export interface PasswordCreationResetAttributes extends Omit<PasswordResetAttributes, "id" | "isVerified"> { }

export interface ManagerAttributes {
  id: number;
  userId: number;
}

export interface UnverifiedUserAttributes {
  id: number;
  userId: number;
  code: string;
  expire: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UnverifiedUserCreationAttributes extends Omit<UnverifiedUserAttributes, "id" | "createdAt" | "updatedAt"> { }
