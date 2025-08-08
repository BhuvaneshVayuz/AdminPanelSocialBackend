import express from "express";
import {
    getAllChildSprints,
    getChildSprintById,
    createChildSprint,
    updateChildSprint,
    deleteChildSprint,
} from "../controllers/childSprintController.js";

const router = express.Router();

router.post("/", createChildSprint);
router.get("/", getAllChildSprints);
router.get("/:id", getChildSprintById);
router.put("/:id", updateChildSprint);
router.delete("/:id", deleteChildSprint);

export default router;
