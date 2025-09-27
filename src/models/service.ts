import { BelongsToManySetAssociationsMixin, DataTypes, Model, Sequelize } from "sequelize";
import { ServiceAttributes, ServiceCreationAttributes } from "../types/models";
import { RequiredDoc } from "./requiredDocs";

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public duration!: string;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setRequiredDocs!: BelongsToManySetAssociationsMixin<RequiredDoc, number>;

  static associate(models: any) {
    Service.hasMany(models.ServiceQuestion, {
      foreignKey: "serviceId",
      as: "questions",
      onDelete: "CASCADE",
    });

    Service.belongsToMany(models.RequiredDoc, {
      through: "ServiceRequiredDocs",
      foreignKey: "serviceId",
      otherKey: "docId",
      as: "requiredDocs",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Service.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "services",
      timestamps: true,
      indexes: [{ name: "title_index", unique: false, fields: ["title"] }],
    }
  );

  return Service;
};
