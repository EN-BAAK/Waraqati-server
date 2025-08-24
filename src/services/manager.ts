import { Manager } from "../models/manager";
import { User } from "../models/user";

export const getManagerByUserId = async (userId: number) => {
  const manager = await Manager.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: "user",
        attributes: { exclude: ["password", "imgUrl"] },
      },
    ],
  });

  if (!manager) return null;

  const json = manager.toJSON() as any;
  return {
    ...json.user,
    id: json.user.id,
  };
};
