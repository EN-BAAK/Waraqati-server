import { Request } from "../models/request";
import ErrorHandler from "../middlewares/error";
import { REQUESTS_STATE } from "../types/vars";
import { AuthenticatedMulterRequest } from "../types/requests";
import { createAnswer } from "./questionAnswers";
import { createDocument } from "./clientDocuments";
import { Client } from "../models/client";
import db from "../models";
import fs from "fs";
import path from "path";
import { User } from "../models/user";
import { Employee } from "../models/employee";
import { Category } from "../models/category";
import { Service } from "../models/service";

export const getAvailableRequests = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Request.findAndCountAll({
    where: { state: REQUESTS_STATE.IN_QUEUE },
    include: [
      {
        model: Service,
        as: "service",
        attributes: ["title"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["title"],
          },
        ],
      },
      {
        model: Client,
        as: "client",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "middleName", "lastName", "phone"],
          },
        ],
      },
    ],

    attributes: ["id", "state", "createdAt"],

    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((request) => {
    const json = request.toJSON() as any;

    return {
      id: json.id,
      service: json.service?.title || null,
      state: json.state,
      client: json.client?.user
        ? {
          ...json.client?.user,
          name: `${json.client.user.firstName} ${json.client.user.middleName && json.client.user.middleName} ${json.client.user.lastName}`,
        }
        : null,
      category: json.service?.category?.title || null,
      createdAt: json.createdAt,
    };
  });

  return { count, rows: data };
};

export const getClientRequests = async (userId: number, page: number, limit: number) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client) {
    throw new Error("Client not found for this user");
  }

  const clientId = client.id;
  const offset = (page - 1) * limit;

  const { count, rows } = await Request.findAndCountAll({
    where: { clientId },

    include: [
      {
        model: Service,
        as: "service",
        attributes: ["title"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["title"],
          },
        ],
      },
      {
        model: Employee,
        as: "employee",
        required: false,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      },
    ],

    attributes: ["id", "state", "createdAt"],

    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const data = rows.map((request) => {
    const json = request.toJSON() as any;

    return {
      id: json.id,
      service: json.service?.title || null,
      state: json.state,
      employee: json.employee?.user
        ? {
          id: json.employee.user.id,
          name: `${json.employee.user.firstName} ${json.employee.user.lastName}`,
        }
        : null,
      category: json.service?.category?.title || null,
      createdAt: json.createdAt,
    };
  });

  return { count, rows: data };
};

export const createRequest = async (req: AuthenticatedMulterRequest) => {
  const serviceId = parseInt(req.params.serviceId);
  const userId = req.id!;

  const client = await Client.findOne({ where: { userId } })
  if (!client)
    throw new ErrorHandler("Internal Server Error", 500)

  const t = await db.sequelize!.transaction();

  try {
    const request = await Request.create({ serviceId, clientId: client.id, state: REQUESTS_STATE.IN_QUEUE }, { transaction: t });
    const questions: any[] = [];

    Object.keys(req.body).forEach((key) => {
      const match = key.match(/questions\[(\d+)\]\.(id|answer)/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2];

        if (!questions[index]) questions[index] = {};
        questions[index][field] = req.body[key];
      }
    });

    for (const q of questions)
      await createAnswer({ questionId: Number(q.id), answer: q.answer, requestId: request.id, }, t);

    const documents = JSON.parse(req.body.documents || "[]");
    const files = req.files as Express.Multer.File[];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const file = files?.[i];

      let fileUrl: string | null = null;

      if (file) {
        fileUrl = `/uploads/documents/${file.filename}`;
        await createDocument({ docId: doc.documentId, clientId: client.id, url: fileUrl, }, t);
      }
    }

    await t.commit();
    return request;
  } catch (error) {
    await t.rollback();
    if (req.files) {
      (req.files as Express.Multer.File[]).forEach((file) => {
        const filePath = path.join(process.cwd(), file.path);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    throw error;
  }
};

export const workOnDemand = async (requestId: number, employeeId: number) => {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  request.employeeId = employeeId;
  request.state = REQUESTS_STATE.IN_HOLD;
  await request.save();

  return request;
};

export const finishRequest = async (requestId: number, employeeId: number) => {
  const request = await Request.findByPk(requestId);
  if (!request || request.employeeId !== employeeId) throw new ErrorHandler("Request not found", 404);

  request.state = REQUESTS_STATE.FINISHED;

  await request.save();

  return request;
};

export const cancelRequest = async (requestId: number, employeeId: number) => {
  const request = await Request.findByPk(requestId);
  if (!request || request.employeeId !== employeeId) throw new ErrorHandler("Request not found", 404);

  request.state = REQUESTS_STATE.CANCELED;

  await request.save();

  return request;
};