import express from "express";
import * as serviceController from "../controllers/service";
import { createServiceValidation, updateServiceValidation, validatePagination, validateServiceId } from "../validations/service";
import { validationMiddleware } from "../middlewares/error";

const router = express.Router();

router.get("/", validatePagination, validationMiddleware, serviceController.getServices);
router.get("/:id", validateServiceId, validationMiddleware, serviceController.getServiceById);

router.delete("/:id", validateServiceId, validationMiddleware, serviceController.deleteService);

router.post("/", createServiceValidation, validationMiddleware, serviceController.createService);
router.put("/:id", updateServiceValidation, validationMiddleware, serviceController.updateService);

export default router;
