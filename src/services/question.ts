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
  const category = await checkCategoryExists(data.categoryId);

  const question = await Question.create(data);
  return {
    id: question.id,
    question: question.question,
    answer: question.answer,
    isActive: question.isActive,
    order: question.order,
    categoryId: undefined,
    category: category?.title ?? ""
  };
};

export const updateQuestion = async (id: number, data: any) => {
  const question = await checkQuestionExists(id);

  ["question", "answer", "isActive"].forEach((key) => {
    if (data[key]) (question as any)[key] = data[key];
  });

  if (data.categoryId) {
    const category = await checkCategoryExists(data.categoryId);

    if (category)
      question.categoryId = category.id
    else
      question.categoryId = null
  }

  const category = await checkCategoryExists(data.categoryId || question.categoryId);

  await question.save();
  return {
    id: question.id,
    question: question.question,
    answer: question.answer,
    isActive: question.isActive,
    order: question.order,
    categoryId: undefined,
    category: category?.title ?? ""
  };
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
  const categories = await Category.findAll({
    attributes: ["id", "title"],
    include: [
      {
        model: Question,
        as: "questions",
        attributes: ["id", "question", "answer", "order", "isActive"],
        required: false,
      },
    ],
    order: [
      ["id", "ASC"],
      [{ model: Question, as: "questions" }, "order", "ASC"],
      [{ model: Question, as: "questions" }, "id", "ASC"],
    ],
  });

  const uncategorizedQuestions = await Question.findAll({
    where: { categoryId: null },
    attributes: ["id", "question", "answer", "order", "isActive"],
    order: [["order", "ASC"], ["id", "ASC"]],
  });

  const result = categories
    .map((cat) => {
      const json = cat.toJSON() as any;
      if (!json.questions || json.questions.length === 0) return null;
      return {
        category: json.title,
        questions: json.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          order: q.order,
          isActive: q.isActive,
        })),
      };
    })
    .filter(Boolean);

  if (uncategorizedQuestions.length > 0) {
    result.push({
      category: "",
      questions: uncategorizedQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        order: q.order,
        isActive: q.isActive,
      })),
    });
  }

  return result;
};

export const getActiveQuestions = async () => {
  const questions = await Question.findAll({
    where: { isActive: true },
    attributes: ["id", "question", "answer"],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["title"],
        required: false,
      },
    ],
    order: [["order", "ASC"], ["id", "ASC"]],
  });

  return questions.map((q) => {
    const json = q.toJSON() as any;
    return {
      id: json.id,
      question: json.question,
      answer: json.answer,
      order: json.order,
      category: json.category ? json.category.title : null,
    };
  });
};

export const toggleIsActive = async (id: number) => {
  const question = await checkQuestionExists(id);
  question.isActive = !question.isActive;
  await question.save();
  return question;
};

export const getQuestionById = async (id: number) => {
  const question = await Question.findByPk(id, {
    attributes: ["id", "question", "answer", "order", "isActive"],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id"],
        required: false,
      },
    ],
  });

  if (!question) throw new ErrorHandler("Question not found", 404);

  const json = question.toJSON() as any;
  return {
    id: json.id,
    question: json.question,
    answer: json.answer,
    order: json.order,
    isActive: json.isActive,
    categoryId: json.category ? json.category.id : null,
  };
};
