export enum SEX {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum ROLE {
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER"
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};

export enum QUESTION_TYPE {
  Number = "Number",
  Text = "Text",
  MultiChoice = "MultiChoice",
}