// routes/teamRoutes.js
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/checkPermissionMiddleware.js";
import * as teamController from "../controllers/teamController.js";

const router = express.Router();

// === CRUD routes ===
router.post(
    "/",
    authMiddleware,
    checkPermission("team:create"),
    teamController.createTeam
);

router.get(
    "/:teamId",
    authMiddleware,
    checkPermission("team:view"),
    teamController.getTeam
);

router.put(
    "/:teamId",
    authMiddleware,
    checkPermission("team:update"),
    teamController.updateTeam
);

router.delete(
    "/:teamId",
    authMiddleware,
    checkPermission("team:delete"),
    teamController.deleteTeam
);

// === List teams by SBU ===
router.get(
    "/sbu/:sbuId",
    authMiddleware,
    checkPermission("team:view"),
    teamController.listTeams
);

export default router;
