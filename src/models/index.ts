import { Sequelize } from "sequelize";
import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import configFile from "../config/config";
import User from "./user";
import Employee from "./employee";

const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

if (!config) throw new Error(`Config for ${env} not found`);

const db: { [key: string]: any; sequelize?: Sequelize; Sequelize?: typeof Sequelize } = {};

let sequelize: Sequelize;

if ((config as any).use_env_variable) {
  const connectionString = process.env[(config as any).use_env_variable];
  if (!connectionString) throw new Error("Environment variable not set");
  sequelize = new Sequelize(connectionString, config as any);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config as any
  );
}

readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file.indexOf(".test.") === -1
  )
  .forEach((file) => {
    const model = require(join(__dirname, file)).default;
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Employee = Employee

export default db;
