import { Optional } from "sequelize";
import { QUESTION_TYPE, SEX } from "./vars";

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

export interface ServiceAttributes {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ServiceCreationAttributes = Omit<ServiceAttributes, "id" | "createdAt" | "updatedAt">;

export interface ServiceQuestionAttributes {
  id: number;
  question: string;
  type: QUESTION_TYPE;
  serviceId: number;
}

export type ServiceQuestionCreationAttributes = Omit<ServiceQuestionAttributes, "id" | "createdAt" | "updatedAt">;

export interface RequiredDocAttributes {
  id: number;
  label: string;
}

export type RequiredDocCreationAttributes = Omit<RequiredDocAttributes, "id" | "createdAt" | "updatedAt">;

export interface ServiceRequiredDocsAttributes {
  serviceId: number;
  docId: number;
}

export type ServiceRequiredDocsCreationAttributes = ServiceRequiredDocsAttributes;

export interface ServiceQuestionChoiceAttributes {
  questionId: number;
  text: string;
}

export type ServiceQuestionChoiceCreationAttributes = Omit<ServiceQuestionChoiceAttributes, "createdAt" | "updatedAt">;

export interface CategoryAttributes {
  id: number;
  title: string;
  desc: string;
  imgUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryCreationAttributes
  extends Omit<CategoryAttributes, "id" | "createdAt" | "updatedAt"> { }