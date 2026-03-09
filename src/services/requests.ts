import { Request } from "../models/request";
import ErrorHandler from "../middlewares/error";
import { REQUESTS_STATE } from "../types/vars";

export const createRequest = async (serviceId: number, clientId: number) => {
  const request = await Request.create({ serviceId, clientId, state: REQUESTS_STATE.IN_QUEUE });
  return request;
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