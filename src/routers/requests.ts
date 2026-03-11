import { Router } from "express";
import { createRequest, workOnDemand, finishRequest, cancelRequest } from "../controllers/request";
import { validationMiddleware } from "../middlewares/error";
import { RequestId, ServiceIdParam, } from "../validations/request";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = Router();

router.post("/:serviceId", verifyAuthentication, requireRole([ROLE.CLIENT]), ServiceIdParam, validationMiddleware, createRequest);

router.put("/:id/work", RequestId, validationMiddleware, workOnDemand);
router.put("/:id/finish", RequestId, validationMiddleware, finishRequest);
router.put("/:id/cancel", RequestId, validationMiddleware, cancelRequest);

export default router;