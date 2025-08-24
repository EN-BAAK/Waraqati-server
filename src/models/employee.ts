import { DataTypes, Model, Sequelize } from "sequelize";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../types/models";

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes {
  public id!: number;
  public userId!: number;
  public rate!: number;
  public isAvailable!: boolean;
  public isAdmin!: boolean;
  public creditor!: number;
  public debit!: number;

  static associate(models: any) {
    Employee.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    models.User.hasOne(Employee, { foreignKey: "userId", as: "employee" });
  }
}

export default (sequelize: Sequelize) => {
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
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 5 },
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
      sequelize,
      tableName: "employees",
      timestamps: false,
    }
  );

  return Employee;
};
