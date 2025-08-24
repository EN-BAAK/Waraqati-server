import { Request, Response } from "express";
import * as clientService from "../services/clients";
import * as userService from "../services/user";
import ErrorHandler, { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

export const getClients = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const clients = await clientService.getClients(page, limit);
  return sendSuccessResponse(res, 200, "Clients have been found",
    {
      total: clients.count,
      page,
      pages: Math.ceil(clients.count / limit),
      data: clients.rows,
    }
  )
})

export const getClientByUserId = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10);
  const client = await clientService.getClientByUserId(id);

  if (!client) throw new ErrorHandler("Client not found", 404);
  return sendSuccessResponse(res, 200, "Client has been found", { client });
})

export const createClient = catchAsyncErrors(async (req: Request, res: Response) => {
  const { user, client } = req.body;

  const newUser = await userService.createUser(user);
  const newClient = await clientService.createClient({ ...client, userId: newUser.id });

  return sendSuccessResponse(res, 201, "Client created successfully", { client: newClient });
});