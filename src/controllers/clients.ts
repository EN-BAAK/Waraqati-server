import { Request, Response } from "express";
import * as clientService from "../services/clients";
import * as userService from "../services/user";
import ErrorHandler, { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { unflatten } from "../utils/global";

export const getClients = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const search = (req.query.search as string) || "";

  const clients = await clientService.getClients(page, limit, search);

  const total = clients.count;
  const totalPages = Math.ceil(total / limit);

  return sendSuccessResponse(res, 200, "Clients found successfully", {
    items: clients.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  });
});


export const getClientByUserId = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10);
  const client = await clientService.getClientByUserId(id);

  if (!client) throw new ErrorHandler("Client not found", 404);
  return sendSuccessResponse(res, 200, "Client has been found", client);
})

export const createClient = catchAsyncErrors(async (req: Request, res: Response) => {
  const parse = unflatten(req.body)
  const { user, client } = parse
  user.password = user.phone

  const newUser = await userService.createUser(user, req);
  const newClient = await clientService.createClient({ ...client, userId: newUser.id });

  return sendSuccessResponse(res, 201, "Client created successfully", newClient);
});

export const updateClient = catchAsyncErrors(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const parse = unflatten(req.body);
  const { user: userData, client: clientData } = parse;

  if (Boolean(userData || req.files?.length))
    await userService.updateUser(userId, userData, req)

  const updatedClient = await clientService.updateClient(userId, clientData || {});
  return sendSuccessResponse(res, 200, "Client updated successfully", updatedClient);
});

export const updateClientSpecialization = catchAsyncErrors(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10)
  const { isSpecial } = req.body

  const result = await clientService.updateClientSpecialization(userId, isSpecial)
  return sendSuccessResponse(res, 200, result.message, result.client);
})