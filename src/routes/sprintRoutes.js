import express from "express";
import {
    getAllSprints,
    getSprintById,
    createSprint,
    updateSprint,
    deleteSprint,
} from "../controllers/sprintController.js";

const router = express.Router();

router.post("/", createSprint);
router.get("/", getAllSprints);
router.get("/:id", getSprintById);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);

export default router;
