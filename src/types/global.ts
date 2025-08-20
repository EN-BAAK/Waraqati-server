import { Dialect } from "sequelize";

export interface IConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}