import express from "express";
import {
    createTeamController,
    getTeamsController,
    getTeamByIdController,
    updateTeamController,
    deleteTeamController,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", createTeamController);
router.get("/", getTeamsController);
router.get("/:id", getTeamByIdController);
router.put("/:id", updateTeamController);
router.delete("/:id", deleteTeamController);

export default router;
