import express from "express";
import * as serviceController from "../controllers/service";
import { createServiceValidation, updateServiceValidation, validatePagination, validateServiceId, validateUserId } from "../validations/service";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";

const router = express.Router();

router.get("/", validatePagination, validationMiddleware, serviceController.getServices);
router.get("/employee/latest/:userId", verifyAuthentication, validateUserId, validationMiddleware, serviceController.getLatestServices);
router.get("/employee/top/:userId", verifyAuthentication, validateUserId, validationMiddleware, serviceController.getTopService);
router.get("/:id/detailed", validateServiceId, validationMiddleware, serviceController.getCategoricServiceById);
router.get("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), validateServiceId, validationMiddleware, serviceController.getServiceById);

router.delete("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), validateServiceId, validationMiddleware, serviceController.deleteService);

router.post("/", verifyAuthentication, requireRole([ROLE.MANAGER]), createServiceValidation, validationMiddleware, serviceController.createService);
router.put("/:id", verifyAuthentication, requireRole([ROLE.MANAGER]), updateServiceValidation, validationMiddleware, serviceController.updateService);

export default router;
