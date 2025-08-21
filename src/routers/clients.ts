import { Router } from "express";
import * as clientController from "../controllers/clients";
import { createClient_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";

const router = Router();

router.get("/", validatePagination, validationMiddleware, clientController.getClients);
router.get("/:userId", validateUserId, validationMiddleware, clientController.getClientByUserId);

router.post("/", createClient_UserValidation, validationMiddleware, clientController.createClient);

export default router;
