// controllers/organizationController.js
import { sendErrorResponse, sendResponse } from "../utils/responseHandler.js";
import * as userService from "../services/userService.js";
import * as rbacService from "../services/rbacService.js";
import * as orgService from "../services/organizationService.js";

/* ------------------ CREATE ORG ------------------ */
export const createOrganization = async (req, res) => {
    try {
        const { name, adminId, ...rest } = req.body;

        if (!name || !adminId) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: "name and adminId are required",
            });
        }

        // ✅ Create organization via service
        const org = await orgService.createOrganization({ name, adminId, ...rest });

        // ✅ Assign org_admin role to admin user
        const user = await userService.findUserBySocialId(adminId);
        if (!user) {
            return sendErrorResponse({ res, statusCode: 404, message: "Admin user not found" });
        }

        await rbacService.assignRole({
            userId: user._id,
            roleName: "org_admin",
            orgId: org._id,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: "Organization created successfully",
            data: org,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ LIST ORGS ------------------ */
export const getOrganizations = async (req, res) => {
    try {
        // ✅ Use logged-in user from req.user (populated by authMiddleware)
        const user = req.user;

        const orgs = await orgService.getOrganizationsByUser(user);

        return sendResponse({
            res,
            statusCode: 200,
            message:
                user.role === "superadmin"
                    ? "All organizations fetched"
                    : "Organizations for admin fetched",
            data: orgs,
        });
    } catch (err) {
        return sendErrorResponse({
            res,
            statusCode: 500,
            message: err.message,
        });
    }
};

/* ------------------ GET ORG BY ID ------------------ */
export const getOrganizationById = async (req, res) => {
    try {
        const { orgId } = req.params;
        const org = await orgService.getOrganizationById(orgId);

        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization fetched",
            data: org,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ UPDATE ORG ------------------ */
export const updateOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { adminId, ...updates } = req.body;

        const org = await orgService.updateOrganization(orgId, updates);

        // ✅ If adminId changes, reassign org_admin role
        if (adminId && adminId !== org.adminId) {
            const newAdmin = await userService.findUserBySocialId(adminId);
            if (!newAdmin) {
                return sendErrorResponse({ res, statusCode: 404, message: "New admin user not found" });
            }

            await rbacService.assignRole({
                userId: newAdmin._id,
                roleName: "org_admin",
                orgId: org._id,
            });

            org.adminId = adminId;
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization updated",
            data: org,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ DELETE ORG ------------------ */
export const deleteOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;
        const org = await orgService.deleteOrganization(orgId);

        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization deleted",
            data: org,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};
