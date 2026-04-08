import { DataTypes, Model, Sequelize } from "sequelize";
import { RequestRateAttributes, RequestRateCreationAttributes } from "../types/models";

export class RequestRate extends Model<RequestRateAttributes, RequestRateCreationAttributes> implements RequestRateAttributes {
  public id!: number;
  public requestId!: number;
  public clientId!: number | null;
  public rate!: number;

  public toJSON(): object {
    const values: Partial<RequestRateAttributes> = { ...this.get() };
    return values;
  }

  static associate(models: any) {
    RequestRate.belongsTo(models.Request, {
      foreignKey: "requestId",
      as: "request",
      onDelete: "CASCADE",
    });
    models.Request.hasOne(RequestRate, { foreignKey: "requestId", as: "rate" });

    RequestRate.belongsTo(models.Client, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "SET NULL",
    });
    models.Client.hasMany(RequestRate, { foreignKey: "clientId", as: "requestRates" });
  }
}

export default (sequelize: Sequelize) => {
  RequestRate.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      requestId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      rate: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      sequelize,
      tableName: "request_rates",
    }
  );
  return RequestRate;
};
