export enum SEX {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum ROLE {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN"
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};