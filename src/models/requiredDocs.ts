import { DataTypes, Model, Sequelize } from "sequelize";
import { RequiredDocAttributes, RequiredDocCreationAttributes } from "../types/models";

export class RequiredDoc
  extends Model<RequiredDocAttributes, RequiredDocCreationAttributes>
  implements RequiredDocAttributes {
  public id!: number;
  public label!: string;

  static associate(models: any) {
    RequiredDoc.belongsToMany(models.Service, {
      through: "ServiceRequiredDocs",
      foreignKey: "docId",
      otherKey: "serviceId",
      as: "services",
      onDelete: "CASCADE",
    });
  }
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
