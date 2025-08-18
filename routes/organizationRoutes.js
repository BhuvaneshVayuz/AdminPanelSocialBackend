// routes/organizationRoutes.js
import express from "express";
import * as orgController from "../controllers/organizationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/checkPermissionMiddleware.js";

const router = express.Router();

// CREATE organization (superadmin only)
router.post(
    "/",
    authMiddleware,
    checkPermission("org:create"),
    orgController.createOrganization
);

router.get("/options", orgController.getOrganizationOptions);

// READ all organizations (superadmin only, or org_admin sees their orgs)
router.get(
    "/",
    authMiddleware,
    checkPermission("org:view"),
    orgController.getOrganizations
);

// READ single organization
router.get(
    "/:orgId",
    authMiddleware,
    checkPermission("org:view"),
    orgController.getOrganizationById
);

// UPDATE organization (org_admin of that org or superadmin)
router.put(
    "/:orgId",
    authMiddleware,
    checkPermission("org:update"),
    orgController.updateOrganization
);

// DELETE organization (superadmin only)
router.delete(
    "/:orgId",
    authMiddleware,
    checkPermission("org:delete"),
    orgController.deleteOrganization
);




export default router;
