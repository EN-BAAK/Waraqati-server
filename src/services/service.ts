import { Op, Transaction } from "sequelize";
import { Service } from "../models/service";
import { ServiceQuestion } from "../models/serviceQuestion";
import { ServiceQuestionChoice } from "../models/serviceQuestionChoice";
import { RequiredDoc } from "../models/requiredDocs";
import ErrorHandler from "../middlewares/error";
import db from "../models"
import { QUESTION_TYPE } from "../types/vars";

export const getAllServices = async (page: number, limit: number, title?: string) => {
  const offset = (page - 1) * limit;

  const where = title
    ? { title: { [Op.like]: `%${title}%` } }
    : {};

  const { count, rows } = await Service.findAndCountAll({
    where,
    attributes: ["id", "title", "description", "price", "duration"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  const data = rows.map((service) => service.toJSON());

  return { count, rows: data };
};

export const getDetailedServiceById = async (id: number) => {
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
        attributes: ["id", "label"],
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
    choices: q.type === QUESTION_TYPE.MultiChoice ? q.choices.map((c: any) => c.text) : null,
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

export const getServiceById = async (id: number, t?: Transaction) => {
  const service = await Service.findByPk(id, {
    attributes: ["id", "title", "description", "duration", "price"],
    transaction: t
  });

  if (!service) throw new ErrorHandler("Service not found", 404);

  const json = service.toJSON() as any;

  return { ...json }
};

export const deleteService = async (id: number) => {
  const service = await Service.findByPk(id);
  if (!service) {
    throw new ErrorHandler("Service not found", 404);
  }

  await service.destroy();
  return { id };
};

export const createService = async (data: any) => {
  const { title, description, duration, price, questions, requiredDocs } = data;

  const labels = requiredDocs.map((d: any) => d.label?.trim()).filter(Boolean);

  return await db.sequelize!.transaction(async (t) => {
    const service = await Service.create({ title, description, duration, price }, { transaction: t });

    for (const q of questions) {
      const question = await ServiceQuestion.create({ question: q.question, type: q.type, serviceId: service.id }, { transaction: t });
      if (q.type === QUESTION_TYPE.MultiChoice && Array.isArray(q.choices) && q.choices.length) {
        const choices = q.choices.map((c: string) => ({ questionId: question.id, text: c }));
        await ServiceQuestionChoice.bulkCreate(choices, { transaction: t });
      }
    }

    const existingDocs = await RequiredDoc.findAll({
      where: { label: labels },
      transaction: t,
    });

    const existingMap = new Map(existingDocs.map(d => [d.label, d]));

    const docIds: number[] = [];

    for (const rd of requiredDocs) {
      const label = (typeof rd === "string") ? rd.trim() : rd.label.trim();
      const state = rd.state ?? "auto";

      if (state === "exists") {
        const found = existingMap.get(label);
        if (!found) throw new ErrorHandler(`RequiredDoc "${label}" not found`, 400);
        docIds.push(found.id);
      } else {
        if (existingMap.has(label)) {
          docIds.push(existingMap.get(label)!.id);
        } else {
          const created = await RequiredDoc.create({ label }, { transaction: t });
          docIds.push(created.id);
          existingMap.set(label, created);
        }
      }
    }

    await (service as any).setRequiredDocs(docIds, { transaction: t });

    const result = await getServiceById(service.id, t)
    return result;
  });
};

export const updateService = async (id: number, data: any) => {
  const { title, description, duration, price, questions, requiredDocs } = data;

  return await db.sequelize!.transaction(async (t: Transaction) => {
    const service = await Service.findByPk(id, { transaction: t });
    if (!service) throw new ErrorHandler("Service not found", 404);

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (duration !== undefined) service.duration = duration;
    if (price !== undefined) service.price = price;
    await service.save({ transaction: t });

    await ServiceQuestion.destroy({ where: { serviceId: service.id }, transaction: t });

    if (questions)
      for (const q of questions) {
        const question = await ServiceQuestion.create(
          { question: q.question, type: q.type, serviceId: service.id },
          { transaction: t }
        );

        if (q.type === QUESTION_TYPE.MultiChoice && Array.isArray(q.choices) && q.choices.length) {
          const choices = q.choices.map((c: string) => ({ questionId: question.id, text: c }));
          await ServiceQuestionChoice.bulkCreate(choices, { transaction: t });
        }
      }

    if (requiredDocs) {
      const docIds: number[] = [];

      for (const rd of requiredDocs) {
        const label = rd.label?.trim();
        const state = rd.state;

        if (!label || !state) {
          throw new ErrorHandler("Each requiredDoc must have label and state", 400);
        }

        if (state === "deleted") {
          const doc = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (doc) {
            await (service as any).removeRequiredDoc(doc, { transaction: t });
          }
        } else if (state === "new") {
          const existing = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (existing) {
            throw new ErrorHandler(`RequiredDoc "${label}" already exists`, 400);
          }
          const created = await RequiredDoc.create({ label }, { transaction: t });
          docIds.push(created.id);
        } else if (state === "exists") {
          const existing = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (!existing) {
            throw new ErrorHandler(`RequiredDoc "${label}" not found`, 400);
          }
          docIds.push(existing.id);
        }
      }

      if (docIds.length) {
        await (service as any).addRequiredDocs(docIds, { transaction: t });
      }
    }

    return await getServiceById(service.id, t);
  });
};