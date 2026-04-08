import { Router } from "express";
import { getEmployeeRatings, getServiceRatings, rateRequest, getClientRating } from "../controllers/requestRate";
import { verifyAuthentication, requireRole } from "../middlewares/auth";
import { ROLE } from "../types/vars";
import { validationMiddleware } from "../middlewares/error";
import { rateCreation, requestId, serviceId, userId } from "../validations/requestRate";

const router = Router();

router.get("/employee/:userId", verifyAuthentication, userId, validationMiddleware, getEmployeeRatings);
router.get("/service/:serviceId", verifyAuthentication, serviceId, validationMiddleware, getServiceRatings);
router.get("/client/:requestId", verifyAuthentication, requireRole([ROLE.CLIENT]), requestId, validationMiddleware, getClientRating);

router.put("/:requestId", verifyAuthentication, requireRole([ROLE.CLIENT]), rateCreation, validationMiddleware, rateRequest);


export default router;
