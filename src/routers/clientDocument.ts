import { Router } from "express";
import { getAllClientDocuments, downloadClientDocument } from "../controllers/clientDocument";
import { validationMiddleware } from "../middlewares/error";
import { validateDocumentId } from "../validations/clientDocument";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.get("/", verifyAuthentication, requireRole([ROLE.CLIENT]), getAllClientDocuments);
router.get("/:id/download", verifyAuthentication, requireRole([ROLE.CLIENT]), validateDocumentId, validationMiddleware, downloadClientDocument);

export default router;