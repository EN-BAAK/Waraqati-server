import { DataTypes, Model } from "sequelize";
import { PasswordCreationResetAttributes, PasswordResetAttributes } from "../types/models";
import db from "./index"

export class PasswordReset extends Model<PasswordResetAttributes, PasswordCreationResetAttributes> implements PasswordResetAttributes {
  public id!: number;
  public userId!: number;
  public code!: string;
  public expiresAt!: Date;
  public isVerified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordReset.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db.sequelize!,
    tableName: "password_resets",
    timestamps: true
  }
);
