// routes/organizationRoutes.js
import express from "express";
import {
    createOrganization,
    getAllOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    getOrganizationOptions
} from "../controllers/organizationController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/checkPermissionMiddleware.js";

const router = express.Router();




router.get("/options", getOrganizationOptions);


// 🔹 Create Organization with auth + permission check
router.post(
    "/",
    authenticateUser,
    checkPermission("org:create", "organization"),
    createOrganization
);

// Other routes (you can later add permission checks here too)
router.get("/", authenticateUser, getAllOrganizations);
router.get("/:id", authenticateUser, getOrganizationById);
router.put("/:id", authenticateUser, updateOrganization);
router.delete("/:id", authenticateUser, deleteOrganization);

export default router;
