import { DataTypes, Model, Sequelize } from "sequelize";
import { ManagerAttributes } from "../types/models";

export class Manager extends Model<ManagerAttributes> implements ManagerAttributes {
  public id!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Manager.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
    models.User.hasOne(Manager, { foreignKey: "userId", as: "manager" });
  }
}

export default (sequelize: Sequelize) => {
  Manager.init(
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
    },
    {
      sequelize,
      tableName: "managers",
      timestamps: true,
    }
  );

  return Manager;
};
