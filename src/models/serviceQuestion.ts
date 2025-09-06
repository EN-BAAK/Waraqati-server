import { DataTypes, Model, Sequelize } from "sequelize";
import { ServiceQuestionAttributes, ServiceQuestionCreationAttributes } from "../types/models";
import { QUESTION_TYPE } from "../types/vars";

export class ServiceQuestion
  extends Model<ServiceQuestionAttributes, ServiceQuestionCreationAttributes>
  implements ServiceQuestionAttributes {
  public id!: number;
  public question!: string;
  public type!: QUESTION_TYPE;
  public serviceId!: number;

  static associate(models: any) {
    ServiceQuestion.belongsTo(models.Service, { foreignKey: "serviceId", as: "service", onDelete: "CASCADE" });

    ServiceQuestion.hasMany(models.ServiceQuestionChoice, {
      foreignKey: "questionId",
      as: "choices",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  ServiceQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(QUESTION_TYPE)),
        allowNull: false,
      },
      serviceId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "services", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "service_questions",
      timestamps: false,
    }
  );

  return ServiceQuestion;
};
