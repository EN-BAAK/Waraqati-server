import { DataTypes, Model, Sequelize } from "sequelize";
import { ServiceQuestionChoiceAttributes, ServiceQuestionChoiceCreationAttributes } from "../types/models";

export class ServiceQuestionChoice
  extends Model<ServiceQuestionChoiceAttributes, ServiceQuestionChoiceCreationAttributes>
  implements ServiceQuestionChoiceAttributes {
  public questionId!: number;
  public text!: string;

  static associate(models: any) {
    ServiceQuestionChoice.belongsTo(models.ServiceQuestion, {
      foreignKey: "questionId",
      as: "question",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  ServiceQuestionChoice.init(
    {
      questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "service_questions", key: "id" },
        onDelete: "CASCADE",
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING(25),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: "service_question_choices",
      timestamps: false,
    }
  );

  return ServiceQuestionChoice;
};
