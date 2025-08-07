import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProjectById,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProjectById);
router.post("/", createProject);

export default router;
