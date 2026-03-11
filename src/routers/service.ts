import express from "express";
import * as serviceController from "../controllers/service";
import { createServiceValidation, updateServiceValidation, validatePagination, validateServiceId } from "../validations/service";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = express.Router();

router.get("/", validatePagination, validationMiddleware, serviceController.getServices);
router.get("/:id/detailed", validateServiceId, validationMiddleware, serviceController.getCategoricServiceById);
router.get("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), validateServiceId, validationMiddleware, serviceController.getServiceById);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), validateServiceId, validationMiddleware, serviceController.deleteService);

router.post("/", verifyAuthentication, requireRole([ROLE.ADMIN]), createServiceValidation, validationMiddleware, serviceController.createService);
router.put("/:id", verifyAuthentication, requireRole([ROLE.ADMIN]), updateServiceValidation, validationMiddleware, serviceController.updateService);

export default router;
