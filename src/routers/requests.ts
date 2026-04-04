import { Router } from "express";
import { createRequest, cancelRequest, getAuthenticatedClientRequests, getAvailableRequests, getEmployeeRequests, handleAdminEmployeeTransition, handleManagerTransition, getManagerRequests } from "../controllers/request";
import { RequestId, validatePagination, FullFilteredRequests, validateAdminEmployeeTransition, validateManagerTransition, AvailableRequestsValidation } from "../validations/request";
import { validationMiddleware } from "../middlewares/error";
import { requireRole, verifyAuthentication } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { uploadDocuments } from "../utils/multer";

const router = Router();

router.get("/available", verifyAuthentication, requireRole([ROLE.ADMIN, ROLE.EMPLOYEE]), AvailableRequestsValidation, validationMiddleware, getAvailableRequests);
router.get("/client", verifyAuthentication, requireRole([ROLE.CLIENT, ROLE.ADMIN, ROLE.EMPLOYEE]), validatePagination, validationMiddleware, getAuthenticatedClientRequests);
router.get("/employee", verifyAuthentication, requireRole([ROLE.EMPLOYEE, ROLE.ADMIN]), FullFilteredRequests, validationMiddleware, getEmployeeRequests);
router.get("/manager", verifyAuthentication, requireRole([ROLE.MANAGER]), FullFilteredRequests, validationMiddleware, getManagerRequests);

router.post("/:serviceId", verifyAuthentication, requireRole([ROLE.CLIENT]), validationMiddleware, uploadDocuments.array("documentsFiles"), createRequest);

router.put("/:id/cancel", RequestId, validationMiddleware, cancelRequest);
router.put("/:id/state/employee", verifyAuthentication, requireRole([ROLE.ADMIN, ROLE.EMPLOYEE]), validateAdminEmployeeTransition, validationMiddleware, handleAdminEmployeeTransition);
router.put("/:id/state/manager", verifyAuthentication, requireRole([ROLE.MANAGER]), validateManagerTransition, validationMiddleware, handleManagerTransition);

export default router;