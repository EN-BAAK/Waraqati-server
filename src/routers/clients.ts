import { Router } from "express";
import * as clientController from "../controllers/clients";
import { createClient_UserValidation, updateClient_UserValidation, validatePagination, validateUserId } from "../validations/users";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { uploadProfile } from "../utils/multer";

const router = Router();

router.get("/", verifyAuthentication, requireRole([ROLE.MANAGER]), validatePagination, validationMiddleware, clientController.getClients);
router.get("/:userId", verifyAuthentication, requireRole([ROLE.MANAGER]), validateUserId, validationMiddleware, clientController.getClientByUserId);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadProfile.fields([{ name: "profileImage", maxCount: 1 }]), createClient_UserValidation, validationMiddleware, clientController.createClient);

router.put("/:userId", verifyAuthentication, requireRole([ROLE.MANAGER]), uploadProfile.fields([{ name: "profileImage", maxCount: 1 }]), updateClient_UserValidation, validationMiddleware, clientController.updateClient);

export default router;
