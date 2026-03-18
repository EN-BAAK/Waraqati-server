import { QuestionAnswer } from "../models/questionAnswers";
import { QuestionAnswerCreationAttributes } from "../types/models";

export const createAnswer = async (data: QuestionAnswerCreationAttributes, t?: any) => {
  const answer = await QuestionAnswer.create(data, { transaction: t });
  return answer
};