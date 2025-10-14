import { Question } from "../models/question";
import { Category } from "../models/category";
import ErrorHandler from "../middlewares/error";

export const checkQuestionExists = async (id: number) => {
  const question = await Question.findByPk(id);
  if (!question) throw new ErrorHandler("Question not found", 404);
  return question;
};

export const checkCategoryExists = async (id: number | undefined | null) => {
  if (id == null) return null;
  const category = await Category.findByPk(id);
  if (!category) throw new ErrorHandler("Category not found", 404);
  return category;
};

export const createQuestion = async (data: any) => {
  await checkCategoryExists(data.categoryId);

  const question = await Question.create(data);
  return question;
};

export const updateQuestion = async (id: number, data: any) => {
  const question = await checkQuestionExists(id);
  if (data.categoryId) await checkCategoryExists(data.categoryId);

  ["question", "answer", "categoryId"].forEach((key) => {
    if (data[key] !== undefined) (question as any)[key] = data[key];
  });

  await question.save();
  return question;
};

export const deleteQuestion = async (id: number) => {
  const question = await checkQuestionExists(id);
  await question.destroy();
  return { id };
};

export const swapQuestionOrder = async (aQuestionId: number, bQuestionId: number) => {
  const a = await checkQuestionExists(aQuestionId);
  const b = await checkQuestionExists(bQuestionId);

  const temp = a.order;
  a.order = b.order;
  b.order = temp;

  await a.save();
  await b.save();

  return { aQuestionId, bQuestionId };
};

export const getAllQuestions = async () => {
  const questions = await Question.findAll({
    order: [["order", "ASC"], ["id", "ASC"]],
  });
  return questions;
};

export const getActiveQuestions = async () => {
  const questions = await Question.findAll({
    where: { isActive: true },
    order: [["order", "ASC"], ["id", "ASC"]],
  });
  return questions;
};

export const toggleIsActive = async (id: number) => {
  const question = await checkQuestionExists(id);
  question.isActive = !question.isActive;
  await question.save();
  return question;
};
