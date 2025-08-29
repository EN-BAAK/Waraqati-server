import { Router } from "express";
import * as clientController from "../controllers/clients";
import { createClient_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import upload from "../utils/multer";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", verifyAuthentication, requireRole([ROLE.MANAGER]), validatePagination, validationMiddleware, clientController.getClients);
router.get("/:userId", validateUserId, validationMiddleware, clientController.getClientByUserId);

router.post("/", verifyAuthentication, upload.fields([{ name: "profileImage", maxCount: 1 }]), createClient_UserValidation, validationMiddleware, clientController.createClient);

export default router;
