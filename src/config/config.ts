import dotenv from "dotenv";
import { IConfig } from "../types/global";
dotenv.config();

const config: { [key: string]: IConfig } = {
  development: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "password",
    database: "test_db",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: "password",
    database: "prod_db",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

export default config;
