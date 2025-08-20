import { DataTypes, Model } from "sequelize";
import db from "./index";
import User from "./user";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../types/models";

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes {
  public id!: number;
  public userId!: number;
  public rate!: number;
  public isAvailable!: boolean;
  public isAdmin!: boolean;
  public creditor!: number;
  public debit!: number;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    creditor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    debit: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db.sequelize!,
    tableName: "employees",
    timestamps: false,
  }
);

Employee.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Employee, { foreignKey: "userId", as: "employee" });

export default Employee;