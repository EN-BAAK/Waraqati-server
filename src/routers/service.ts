import express from "express";
import * as serviceController from "../controllers/service";
import { validatePagination, validateServiceId } from "../validations/service";
import { validationMiddleware } from "../middlewares/error";

const router = express.Router();

router.get("/", validatePagination, validationMiddleware, serviceController.getServices);
router.get("/:id", validateServiceId, validationMiddleware, serviceController.getServiceById);

router.delete("/:id", validateServiceId, validationMiddleware, serviceController.deleteService);

export default router;
