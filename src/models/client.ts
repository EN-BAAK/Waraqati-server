import { DataTypes, Model } from "sequelize";
import db from "./index";
import User from "./user";
import { ClientAttributes, ClientCreationAttributes } from "../types/models";
import { Sex } from "../types/vars";

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public userId!: number;
  public country!: string;
  public age!: number;
  public sex!: Sex;
  public creditor!: number;
  public debit!: number;
  public isSpecial!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 18
    },
    sex: {
      type: DataTypes.ENUM(...Object.values(Sex)),
      allowNull: false,
      defaultValue: Sex.Male
    },
    creditor: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    debit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    isSpecial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize!,
    tableName: "clients",
    timestamps: true,
  }
);

Client.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Client, { foreignKey: "userId", as: "client" });

export default Client;