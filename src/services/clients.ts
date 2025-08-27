import { Client } from "../models/client";
import { User } from "../models/user";
import { ClientCreationAttributes } from "../types/models";
import { ROLE } from "../types/vars";

export const getClients = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Client.findAndCountAll({
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
      },
    ],
    limit,
    offset,
  });

  const data = rows.map((client) => {
    const json = client.toJSON() as any;
    return {
      ...json,
      id: json.user.id,
      user: undefined,
      userId: undefined,
      createAt: undefined,
      updateAt: undefined,
      ...json.user,
      role: ROLE.CLIENT
    };
  });

  return { count, items: data };
};

export const getClientByUserId = async (id: number) => {
  const client = await Client.findByPk(id, {
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
      },
    ],
  });

  if (!client) return null;

  const json = client.toJSON() as any;
  return {
    ...json,
    id: json.user.id,
    user: undefined,
    userId: undefined,
    ...json.user,
    createdAt: undefined,
    updatedAt: undefined,
    role: ROLE.CLIENT
  };
};

export const createClient = async (data: ClientCreationAttributes) => {
  const client = await Client.create(data);
  const result = getClientByUserId(client.id)
  return result;
};
