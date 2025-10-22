import { Op, Transaction } from "sequelize";
import { Service } from "../models/service";
import { ServiceQuestion } from "../models/serviceQuestion";
import { ServiceQuestionChoice } from "../models/serviceQuestionChoice";
import { RequiredDoc } from "../models/requiredDocs";
import ErrorHandler from "../middlewares/error";
import db from "../models"
import { QUESTION_TYPE } from "../types/vars";
import { Category } from "../models/category";
import { checkCategoryExists } from "./question";

export const getAllServices = async (
  page: number,
  limit: number,
  title?: string,
  categoryTitle?: string
) => {
  const offset = (page - 1) * limit;

  const serviceWhere = title
    ? { title: { [Op.like]: `%${title}%` } }
    : {};

  const categoryWhere = categoryTitle
    ? { title: { [Op.like]: `%${categoryTitle}%` } }
    : {};

  const { count, rows } = await Service.findAndCountAll({
    where: serviceWhere,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["title"],
        required: !!categoryTitle,
        where: categoryWhere,
      },
    ],
    attributes: ["id", "title", "description", "price", "duration"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((service) => {
    const json = service.toJSON() as any;
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      price: json.price,
      duration: json.duration,
      category: json.category ? json.category.title : null,
    };
  });

  return { count, rows: data };
};

export const getDetailedCategoricServiceById = async (id: number) => {
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
      {
        model: Category,
        as: "category",
        attributes: ["title"],
        required: false,
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
    category: json.category ? json.category.title : null,
  };
};
export const getDetailedServiceById = async (id: number) => {
  const service = await Service.findByPk(id, {
    attributes: ["id", "title", "description", "duration", "price", "categoryId"],
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
    categoryId: json.categoryId,
    questions: formattedQuestions,
    requiredDocs: json.requiredDocs,
  };
};

export const getCategoricServiceById = async (id: number, t?: Transaction) => {
  const service = await Service.findByPk(id, {
    transaction: t,
    attributes: { exclude: ["categoryId"] },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["title"],
        required: false,
      },
    ]
  });

  if (!service) throw new ErrorHandler("Service not found", 404);

  const json = service.toJSON() as any;

  return { ...json, category: json.category?.title }
};

export const getServiceById = async (id: number, t?: Transaction) => {
  const service = await Service.findByPk(id, {
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
  const { title, description, duration, price, questions, requiredDocs, categoryId } = data;

  const labels = requiredDocs?.map((d: any) => d.label?.trim()).filter(Boolean) || [];

  return await db.sequelize!.transaction(async (t) => {
    const service = await Service.create(
      { title, description, duration, price, categoryId: categoryId || null },
      { transaction: t }
    );

    for (const q of questions || []) {
      const question = await ServiceQuestion.create(
        { question: q.question, type: q.type, serviceId: service.id },
        { transaction: t }
      );

      if (q.type === QUESTION_TYPE.MultiChoice && Array.isArray(q.choices) && q.choices.length) {
        const choices = q.choices.map((c: string) => ({ questionId: question.id, text: c }));
        await ServiceQuestionChoice.bulkCreate(choices, { transaction: t });
      }
    }

    if (labels.length) {
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
    }

    return await getCategoricServiceById(service.id, t);
  });
};

export const updateService = async (id: number, data: any) => {
  return await db.sequelize!.transaction(async (t: Transaction) => {
    const service = await Service.findByPk(id, { transaction: t });
    if (!service) throw new ErrorHandler("Service not found", 404);

    if (data.title !== undefined) service.title = data.title;
    if (data.description !== undefined) service.description = data.description;
    if (data.duration !== undefined) service.duration = data.duration;
    if (data.price !== undefined) service.price = data.price;

    if (data.categoryId !== undefined) {
      if (data.categoryId === -1) {
        service.categoryId = null;
      } else {
        const category = await checkCategoryExists(data.categoryId);
        service.categoryId = category?.id ?? null;
      }
    }

    await service.save({ transaction: t });

    if (data.questions) {
      await ServiceQuestion.destroy({ where: { serviceId: service.id }, transaction: t });

      for (const q of data.questions) {
        const question = await ServiceQuestion.create(
          { question: q.question, type: q.type, serviceId: service.id },
          { transaction: t }
        );

        if (q.type === QUESTION_TYPE.MultiChoice && Array.isArray(q.choices) && q.choices.length) {
          const choices = q.choices.map((c: string) => ({ questionId: question.id, text: c }));
          await ServiceQuestionChoice.bulkCreate(choices, { transaction: t });
        }
      }
    }

    if (data.requiredDocs) {
      const docIds: number[] = [];

      for (const rd of data.requiredDocs) {
        const label = rd.label?.trim();
        const state = rd.state;

        if (!label || !state) throw new ErrorHandler("Each requiredDoc must have label and state", 400);

        if (state === "deleted") {
          const doc = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (doc) await (service as any).removeRequiredDoc(doc, { transaction: t });
        } else if (state === "new") {
          const existing = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (existing) throw new ErrorHandler(`RequiredDoc "${label}" already exists`, 400);
          const created = await RequiredDoc.create({ label }, { transaction: t });
          docIds.push(created.id);
        } else if (state === "exists") {
          const existing = await RequiredDoc.findOne({ where: { label }, transaction: t });
          if (!existing) throw new ErrorHandler(`RequiredDoc "${label}" not found`, 400);
          docIds.push(existing.id);
        }
      }

      if (docIds.length) await (service as any).addRequiredDocs(docIds, { transaction: t });
    }
    console.log("end")
    return await getCategoricServiceById(service.id, t);
  });
};

