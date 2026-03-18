import { DataTypes, Model, Sequelize } from "sequelize";
import { QuestionAnswerAttributes, QuestionAnswerCreationAttributes } from "../types/models";

export class QuestionAnswer
  extends Model<QuestionAnswerAttributes, QuestionAnswerCreationAttributes>
  implements QuestionAnswerAttributes {
  public id!: number;
  public questionId!: number;
  public requestId!: number;
  public answer!: string;

  static associate(models: any) {
    QuestionAnswer.belongsTo(models.ServiceQuestion, { foreignKey: "questionId", as: "question", onDelete: "CASCADE" });
    models.ServiceQuestion.hasOne(QuestionAnswer, { foreignKey: "questionId", as: "answer" });
    QuestionAnswer.belongsTo(models.Request, { foreignKey: "requestId", as: "request", onDelete: "CASCADE" });
    models.Request.hasMany(QuestionAnswer, { foreignKey: "requestId", as: "answers" });
  }
}

export default (sequelize: Sequelize) => {
  QuestionAnswer.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      requestId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "questions_answers",
      timestamps: false,
    }
  );

  return QuestionAnswer;
};
