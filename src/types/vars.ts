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

export type Blacklisted_Token = {
  token: string;
  expiresAt: number;
};

export enum QUESTION_TYPE {
  Number = "Number",
  Text = "Text",
  MultiChoice = "MultiChoice",
}

export enum REQUESTS_STATE {
  IN_PROGRESS = "in progress",
  CANCELED = "canceled",
  IN_QUEUE = "in queue",
  IN_HOLD = "in hold",
  REVIEWED = "reviewed",
  FINISHED = "finished",
  SUCCEED = "succeed",
}