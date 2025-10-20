import { DataTypes, Model, Sequelize } from "sequelize";
import { QuestionAttributes, QuestionCreationAttributes } from "../types/models";

export class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public question!: string;
  public answer!: string;
  public categoryId!: number | null;
  public order!: number;
  public isActive!: boolean;

  static associate(models: any) {
    Question.belongsTo(models.Category, { foreignKey: "categoryId", as: "category", onDelete: "SET NULL" });
    models.Category.hasMany(Question, { foreignKey: "categoryId", as: "questions" });
  }
}

export default (sequelize: Sequelize) => {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      question: { type: DataTypes.STRING, allowNull: false },
      answer: { type: DataTypes.STRING, allowNull: false },
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    },
    {
      sequelize,
      tableName: "questions",
      timestamps: false,
      hooks: {
        afterCreate: async (question: Question) => {
          if (!question.order) {
            question.order = question.id;
            await question.save();
          }
        },
      },
      indexes: [{ name: "order_index", unique: false, fields: ["order", "id"] }],
    }
  );

  return Question;
};
