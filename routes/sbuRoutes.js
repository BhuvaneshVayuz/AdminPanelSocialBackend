// routes/sbuRoutes.js
import express from "express";
import {
    getAllSBUs,
    getSBUById,
    createSBU,
    updateSBU,
    deleteSBU,
} from "../controllers/sbuController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { checkSBUOwnership } from "../middlewares/checkSbuAccessMiddleware.js";

const router = express.Router();

// Authenticate all routes
router.use(authenticateUser);

// CRUD routes
router.post("/", createSBU);
router.get("/", getAllSBUs);
router.get("/:id", getSBUById);
router.put("/:id", checkSBUOwnership, updateSBU);
router.delete("/:id", checkSBUOwnership, deleteSBU);

export default router;
