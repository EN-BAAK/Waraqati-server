import { Request } from "../models/request";
import { Op } from "sequelize";
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

const checkUserIsOwnTask = async (userId: number, employeeId: number | null) => {
  const employee = await Employee.findOne({ where: { userId } });
  if (!employee || !employeeId) throw new ErrorHandler("Employee not found", 404);

  if (employee.id !== employeeId) {
    throw new ErrorHandler("You can only work on your assigned tasks", 403);
  }
}

const getRequestForClient = async (requestId: number) => {
  const request = await Request.findOne({
    where: { id: requestId },
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

    order: [["createdAt", "DESC"]],
  });

  if (!request) return null;
  const json = request.toJSON() as any

  return {
    id: json.id,
    service: json.service?.title || null,
    state: json.state,
    client: json.client?.user
      ? {
        ...json.employee?.user,
        name: `${json.employee.user.firstName} ${json.employee.user.lastName}`,
      }
      : null,
    category: json.service?.category?.title || null,
    createdAt: json.createdAt,
  };
};

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

export const getEmployeeRequests = async (
  { userId, page, limit, search, state, category }:
    { userId: number, page: number, limit: number, search?: string, state?: string, category?: string }
) => {
  const employee = await Employee.findOne({ where: { userId } });
  if (!employee) {
    throw new Error("Employee not found for this user");
  }

  const employeeId = employee.id;
  const offset = (page - 1) * limit;

  const where: any = { employeeId };
  if (state) {
    where.state = state;
  }

  const include: any[] = [
    {
      model: Service,
      as: "service",
      attributes: ["title"],
      ...(search ? { where: { title: { [Op.like]: `%${search}%` } } } : {}),
      required: !!search || !!category,
      include: [
        {
          model: Category,
          as: "category",
          required: !!category,
          attributes: ["title"],
          ...(category ? { where: { title: category } } : {}),
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
  ];
  const { count, rows } = await Request.findAndCountAll({
    where,
    include,
    attributes: ["id", "state", "createdAt"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    distinct: true,
  });

  const data = rows.map((request) => {
    const json = request.toJSON() as any;
    const clientUser = json.client?.user;
    return {
      id: json.id,
      service: json.service?.title || null,
      client: {
        ...clientUser,
        name: `${clientUser.firstName}${clientUser.middleName ? " " + clientUser.middleName : ""} ${clientUser.lastName}`.trim(),
        firstName: undefined,
        middleName: undefined,
        lastName: undefined
      },
      category: json.service?.category?.title || null,
      state: json.state,
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
          ...json.employee.user,
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
    return await getRequestForClient(request.id);
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

export const inHoldTransaction = async (requestId: number, userId: number) => {
  const request = await Request.findByPk(requestId);
  if (!request || request.state !== REQUESTS_STATE.IN_QUEUE) throw new ErrorHandler("Internal Server Error", 500);

  const employee = await Employee.findOne({ where: { userId } });
  if (!employee) throw new ErrorHandler("Employee not found", 404);

  request.employeeId = employee.id;
  request.state = REQUESTS_STATE.IN_HOLD;
  await request.save();

  return request;
};

export async function cancelRequestTransition(requestId: number, userId: number) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  await checkUserIsOwnTask(userId, request.employeeId);

  if (![REQUESTS_STATE.IN_QUEUE, REQUESTS_STATE.IN_HOLD, REQUESTS_STATE.IN_PROGRESS].includes(request.state)) {
    throw new ErrorHandler("Cannot cancel request in current state", 400);
  }

  request.employeeId = null;
  request.state = REQUESTS_STATE.CANCELED;
  await request.save();
  return request;
}

export async function inProgressTransition(requestId: number, userId: number) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  await checkUserIsOwnTask(userId, request.employeeId);

  if (request.state !== REQUESTS_STATE.IN_HOLD && request.state !== REQUESTS_STATE.FINISHED) {
    throw new ErrorHandler("Request must be in hold to move to in progress", 400);
  }

  request.state = REQUESTS_STATE.IN_PROGRESS;
  await request.save();
  return request;
}

export async function finishTransition(requestId: number, userId: number) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  await checkUserIsOwnTask(userId, request.employeeId);

  if (![REQUESTS_STATE.IN_PROGRESS, REQUESTS_STATE.REVIEWED].includes(request.state)) {
    throw new ErrorHandler("Request must be in progress or reviewed to finish", 400);
  }

  request.state = REQUESTS_STATE.FINISHED;
  await request.save();
  return request;
}

export async function reviewOrSucceedTransition(requestId: number, nextState: REQUESTS_STATE) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  if (request.state !== REQUESTS_STATE.FINISHED) {
    throw new ErrorHandler("Request must be finished to review or succeed", 400);
  }

  if (![REQUESTS_STATE.REVIEWED, REQUESTS_STATE.SUCCEED].includes(nextState)) {
    throw new ErrorHandler("Invalid next state for manager", 400);
  }
  request.state = nextState;
  await request.save();
  return request;
}

export async function moveToQueueFromCanceled(requestId: number) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  if (request.state !== REQUESTS_STATE.CANCELED) {
    throw new ErrorHandler("Only canceled requests can be moved to queue", 400);
  }
  request.state = REQUESTS_STATE.IN_QUEUE;
  request.employeeId = null;
  await request.save();
  return request;
}

export async function quittingRequest(requestId: number, userId: number) {
  const request = await Request.findByPk(requestId);
  if (!request) throw new ErrorHandler("Request not found", 404);

  await checkUserIsOwnTask(userId, request.employeeId);

  if (![REQUESTS_STATE.IN_HOLD].includes(request.state)) {
    throw new ErrorHandler("Request must be in hold to quit", 400);
  }

  request.state = REQUESTS_STATE.IN_QUEUE;
  request.employeeId = null;
  await request.save();
  return request;
}

export const cancelRequest = async (requestId: number, employeeId: number) => {
  const request = await Request.findByPk(requestId);
  if (!request || request.employeeId !== employeeId) throw new ErrorHandler("Request not found", 404);

  request.state = REQUESTS_STATE.CANCELED;

  await request.save();

  return request;
};