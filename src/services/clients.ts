import ErrorHandler from "../middlewares/error";
import { Client } from "../models/client";
import { UnverifiedUser } from "../models/unverifiedUser";
import { User } from "../models/user";
import { ClientCreationAttributes } from "../types/models";
import { ROLE } from "../types/vars";
import { sendAccountVerificationMessage } from "./auth";

export const getClients = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Client.findAndCountAll({
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
        include: [
          {
            model: UnverifiedUser,
            as: "unverified",
            attributes: ["id"],
          },
        ],
      },
    ],
    limit,
    offset,
    order: [[{ model: User, as: "user" }, "createdAt", "DESC"]],
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
      role: ROLE.CLIENT,
      isVerified: !!json.user.isVerified
    };
  });

  return { count, rows: data };
};

export const getClientByUserId = async (id: number) => {
  const client = await Client.findOne({
    where: { userId: id },
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
        include: [
          {
            model: UnverifiedUser,
            as: "unverified",
            attributes: ["id"],
          },
        ],
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
    role: ROLE.CLIENT,
    isVerified: !json.user.unverified,
  };
};

export const createClient = async (data: ClientCreationAttributes) => {
  const client = await Client.create(data);
  const user = await User.findOne({ where: { id: client.userId } })

  if (!user) {
    throw new ErrorHandler("Failed to send verify email, try to login to resend it, or delete the account by manager", 400)
  }

  sendAccountVerificationMessage(user)
  const result = getClientByUserId(user.id)
  return result;
};

export const updateClient = async (
  userId: number,
  employeeData: Partial<any>,
) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client) throw new ErrorHandler("Client not found", 404);

  const updatableFields: (keyof Client)[] = ["sex", "country", "age", "creditor", "debit", "isSpecial"];
  (updatableFields as (keyof Client)[]).forEach((field) => {
    if (field in employeeData && employeeData[field] !== undefined) {
      (client as any)[field] = employeeData[field];
    }
  });

  await client.save();

  return getClientByUserId(userId);
};

export const updateClientSpecialization = async (
  userId: number,
  isSpecial: boolean
) => {
  const client = await Client.findOne({ where: { userId } })
  if (!client) throw new ErrorHandler("Client not found", 404);

  client.isSpecial = isSpecial
  await client.save()

  const updateClient = await getClientByUserId(userId)

  return { message: "Client updated successfully", client: updateClient }
}