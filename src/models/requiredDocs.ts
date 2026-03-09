import { DataTypes, Model, Sequelize } from "sequelize";
import { RequiredDocAttributes, RequiredDocCreationAttributes } from "../types/models";

export class RequiredDoc
  extends Model<RequiredDocAttributes, RequiredDocCreationAttributes>
  implements RequiredDocAttributes {
  public id!: number;
  public label!: string;
}

export default (sequelize: Sequelize) => {
  RequiredDoc.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "required_docs",
      timestamps: false,
      indexes: [{ name: "label_index", unique: false, fields: ["label"] }],
    }
  );

  return RequiredDoc;
};
