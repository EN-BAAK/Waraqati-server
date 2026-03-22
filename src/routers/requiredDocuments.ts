import { Router } from "express";
import * as requiredDocumentController from "../controllers/requiredDocument";
import { createRequiredDocumentValidation, updateRequiredDocumentValidation, validateRequiredDocumentId, deleteRequiredDocumentValidation, } from "../validations/requiredDocument";
import { validationMiddleware } from "../middlewares/error";
import { verifyAuthentication, requireRole } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", requiredDocumentController.getRequiredDocuments);
router.get("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), validateRequiredDocumentId, validationMiddleware, requiredDocumentController.getRequiredDocumentById);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), createRequiredDocumentValidation, validationMiddleware, requiredDocumentController.createRequiredDocument);

router.put("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), updateRequiredDocumentValidation, validationMiddleware, requiredDocumentController.updateRequiredDocument);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), deleteRequiredDocumentValidation, validationMiddleware, requiredDocumentController.deleteRequiredDocument);

export default router;