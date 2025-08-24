import { DataTypes, Model, Sequelize } from "sequelize";
import { ClientAttributes, ClientCreationAttributes } from "../types/models";
import { SEX } from "../types/vars";

export class Client extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes {
  public id!: number;
  public userId!: number;
  public country!: string;
  public age!: number;
  public sex!: SEX;
  public creditor!: number;
  public debit!: number;
  public isSpecial!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Client.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    models.User.hasOne(Client, { foreignKey: "userId", as: "client" });
  }
}

export default (sequelize: Sequelize) => {
  Client.init(
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
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 18,
      },
      sex: {
        type: DataTypes.ENUM(...Object.values(SEX)),
        allowNull: false,
        defaultValue: SEX.Male,
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
      isSpecial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "clients",
      timestamps: true,
    }
  );

  return Client;
};
