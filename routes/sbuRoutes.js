// routes/sbuRoutes.js
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as sbuController from "../controllers/sbuController.js";
import { checkPermission } from "../middlewares/checkPermissionMiddleware.js";

const router = express.Router();

// CRUD routes
router.post(
    "/",
    authMiddleware,
    checkPermission("sbu:create"),
    sbuController.createSBU
);

router.get(
    "/:sbuId",
    authMiddleware,
    checkPermission("sbu:view"),
    sbuController.getSBU
);

router.get(
    "/",
    authMiddleware,
    checkPermission("sbu:view"),
    sbuController.getSBUsByOrg
);

router.put(
    "/:sbuId",
    authMiddleware,
    checkPermission("sbu:update"),
    sbuController.updateSBU
);

router.delete(
    "/:sbuId",
    authMiddleware,
    checkPermission("sbu:delete"),
    sbuController.deleteSBU
);

export default router;
