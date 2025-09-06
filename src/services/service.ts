// services/service.ts
import { Op } from "sequelize";
import { Service } from "../models/service";
import { ServiceQuestion } from "../models/serviceQuestion";
import { ServiceQuestionChoice } from "../models/serviceQuestionChoice";
import { RequiredDoc } from "../models/serviceRequiredDocs";
import ErrorHandler from "../middlewares/error";

export const getAllServices = async (page: number, limit: number, title?: string) => {
  const offset = (page - 1) * limit;

  const where = title
    ? { title: { [Op.like]: `%${title}%` } }
    : {};

  const { count, rows } = await Service.findAndCountAll({
    where,
    attributes: ["id", "title", "description", "price"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((service) => service.toJSON());

  return { count, rows: data };
};

export const getServiceById = async (id: number) => {
  const service = await Service.findByPk(id, {
    attributes: ["id", "title", "description", "duration", "price"],
    include: [
      {
        model: ServiceQuestion,
        as: "questions",
        attributes: ["id", "question", "type"],
        include: [
          {
            model: ServiceQuestionChoice,
            as: "choices",
            attributes: ["text"],
          },
        ],
      },
      {
        model: RequiredDoc,
        as: "requiredDocs",
        attributes: ["id", "label", "fileUrl"],
        through: { attributes: [] },
      },
    ],
  });

  if (!service) throw new ErrorHandler("Service not found", 404);

  const json = service.toJSON() as any;

  const formattedQuestions = json.questions.map((q: any) => ({
    id: q.id,
    question: q.question,
    type: q.type,
    choices: q.type === "multichoice" ? q.choices.map((c: any) => c.text) : null,
  }));

  return {
    id: json.id,
    title: json.title,
    description: json.description,
    duration: json.duration,
    price: json.price,
    questions: formattedQuestions,
    requiredDocs: json.requiredDocs,
  };
};

export const deleteService = async (id: number) => {
  const service = await Service.findByPk(id);
  if (!service) {
    throw new ErrorHandler("Service not found", 404);
  }

  await service.destroy();
  return { id };
};