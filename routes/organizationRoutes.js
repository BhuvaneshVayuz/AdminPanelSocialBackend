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
import { checkOrgAccess } from "../middlewares/checkOrgAccess.js";

const router = express.Router();

// Public org meta data
router.get("/options", getOrganizationOptions);

// Create org (superadmin only)
router.post(
    "/",
    authenticateUser,
    checkPermission("org:create", "organization"),
    createOrganization
);

// List orgs
router.get("/", authenticateUser, getAllOrganizations);

// Get org by id
router.get("/:id", authenticateUser, getOrganizationById);

// Update org
router.put(
    "/:id",
    authenticateUser,
    checkOrgAccess("org:update"),
    updateOrganization
);

// Delete org
router.delete(
    "/:id",
    authenticateUser,
    checkOrgAccess("org:delete"),
    deleteOrganization
);

export default router;
