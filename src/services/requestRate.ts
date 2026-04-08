import { col, fn } from "sequelize";
import { Request } from "../models/request";
import { RequestRate } from "../models/requestRate";
import { Client } from "../models/client";
import ErrorHandler from "../middlewares/error";
import { Employee } from "../models/employee";

export const getEmployeeRatings = async (userId: number) => {
  const employee = await Employee.findOne({ where: { userId } })
  if (!employee)
    throw new ErrorHandler("Employee not found", 404)

  const result = await RequestRate.findOne({
    attributes: [
      [fn("COUNT", col("RequestRate.id")), "count"],
      [fn("AVG", col("RequestRate.rate")), "avg"],
    ],
    include: [
      {
        model: Request,
        as: "request",
        attributes: [],
        where: { employeeId: employee.id },
        required: true,
      },
    ],
    raw: true,
  });

  const json = result as any

  return {
    count: Number(json?.count || 0),
    avg: Number(json?.avg || 0),
  };
};

export const getServiceRatings = async (serviceId: number) => {
  const result = await RequestRate.findOne({
    attributes: [
      [fn("COUNT", col("RequestRate.id")), "count"],
      [fn("AVG", col("RequestRate.rate")), "avg"],
    ],
    include: [
      {
        model: Request,
        as: "request",
        attributes: [],
        where: { serviceId },
        required: true,
      },
    ],
    raw: true,
  });
  const json = result as any

  return {
    count: Number(json?.count || 0),
    avg: Number(json?.avg || 0),
  };
};

export const rateRequest = async (requestId: number, userId: number, rate: number) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client)
    throw new ErrorHandler("CLient not found", 404)

  const [rating, created] = await RequestRate.findOrCreate({
    where: { requestId, clientId: client.id },
  });
  if (!created) {
    rating.rate = rate;
    await rating.save();
  }
  return rating.rate;
};

export const getClientRating = async (requestId: number, userId: number) => {
  const client = await Client.findOne({ where: { userId } });
  if (!client)
    throw new ErrorHandler("CLient not found", 404)

  const rating = await RequestRate.findOne({
    where: { requestId, clientId: client.id },
    attributes: ["rate"],
  });
  return rating ? rating.rate : null;
};
