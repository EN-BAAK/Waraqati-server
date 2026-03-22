import { Router } from "express";
import { createRequest, workOnDemand, finishRequest, cancelRequest, getAuthenticatedClientRequests } from "../controllers/request";
import { validationMiddleware } from "../middlewares/error";
import { RequestId, validatePagination, } from "../validations/request";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { uploadDocuments } from "../utils/multer";

const router = Router();

router.get("/client", verifyAuthentication, requireRole([ROLE.CLIENT]), validatePagination, validationMiddleware, getAuthenticatedClientRequests);
router.post("/:serviceId", verifyAuthentication, requireRole([ROLE.CLIENT]), validationMiddleware, uploadDocuments.array("documentsFiles"), createRequest);

router.put("/:id/work", RequestId, validationMiddleware, workOnDemand);
router.put("/:id/finish", RequestId, validationMiddleware, finishRequest);
router.put("/:id/cancel", RequestId, validationMiddleware, cancelRequest);

export default router;