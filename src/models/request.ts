import { DataTypes, Model, Sequelize } from "sequelize";
import { REQUESTS_STATE } from "../types/vars";
import { RequestAttributes, RequestCreationAttributes } from "../types/models";

export class Request extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
  public id!: number;
  public serviceId!: number;
  public clientId!: number;
  public employeeId!: number | null;
  public state!: REQUESTS_STATE;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    models.Client.hasOne(Request, { foreignKey: "clientId", as: "request" });
    models.Service.hasOne(Request, { foreignKey: "serviceId", as: "request" });
    models.Employee.hasOne(Request, { foreignKey: "employeeId", as: "request" });

    Request.belongsTo(models.Service, {
      foreignKey: "serviceId",
      as: "service",
      onDelete: "CASCADE",
    });

    Request.belongsTo(models.Client, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "CASCADE",
    });

    Request.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
      onDelete: "SET NULL",
    });
  }
}

export default (sequelize: Sequelize) => {
  Request.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      serviceId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      clientId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      employeeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },

      state: {
        type: DataTypes.ENUM("in progress", "canceled", "in queue", "in hold", "reviewed", "finished", "succeed"),
        allowNull: false,
        defaultValue: REQUESTS_STATE.IN_QUEUE,
      },
    },
    {
      sequelize,
      tableName: "requests",
      timestamps: true,
    }
  );

  return Request;
};