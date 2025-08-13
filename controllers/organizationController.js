import { Role } from "../models/roleModel.js";
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import * as orgService from "../services/organizationService.js";
import { ORGANIZATION_SIZES, ORGANIZATION_TYPES } from "../utils/index.js";
import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";


export const createOrganization = async (req, res) => {
    try {
        const { ownerId, ...orgData } = req.body;

        if (!ownerId) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: "ownerId (socialId) is required",
            });
        }

        const orgAdminRole = await Role.findOne({ name: "org_admin" });
        if (!orgAdminRole) {
            return sendErrorResponse({
                res,
                statusCode: 500,
                message: "Org Admin role not found",
            });
        }

        // Step 1: Create Organization
        const org = await orgService.createOrganization({
            ...orgData,
            ownerId,
        });

        // Step 2: Ensure owner exists in UserRoleMapping
        let existingMapping = await UserRoleMapping.findOne({ userId: ownerId });

        if (!existingMapping) {
            // Create mapping if owner not in system
            existingMapping = await UserRoleMapping.create({
                userId: ownerId,
                roleId: orgAdminRole._id,
                entityType: "organization",
                entityId: org._id,
                assignedBy: req.user.socialId || "system",
            });
        } else {
            // Update existing mapping to be org_admin for this organization
            existingMapping.roleId = orgAdminRole._id;
            existingMapping.entityType = "organization";
            existingMapping.entityId = org._id;
            existingMapping.assignedBy = req.user.socialId || "system";
            await existingMapping.save();
        }

        return sendResponse({
            res,
            statusCode: 201,
            message: "Organization created successfully",
            data: org,
        });
    } catch (error) {
        console.error(error);
        return sendErrorResponse({
            res,
            statusCode: 400,
            message: error.message || "Failed to create organization",
            error,
        });
    }
};


export const getAllOrganizations = async (req, res) => {
    try {
        const orgs = await orgService.getAllOrganizations();
        return sendResponse({
            res,
            statusCode: 200,
            message: "Organizations fetched successfully",
            data: orgs,
        });
    } catch (error) {
        return sendErrorResponse({
            res,
            message: error.message || "Failed to fetch organizations",
            error,
        });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const org = await orgService.getOrganizationById(req.params.id);
        if (!org) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Organization not found",
            });
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization fetched successfully",
            data: org,
        });
    } catch (error) {
        return sendErrorResponse({
            res,
            message: error.message || "Failed to fetch organization",
            error,
        });
    }
};

export const updateOrganization = async (req, res) => {
    try {

        if (req.body.ownerId) {
            const newOwnerId = req.body.ownerId;
            const orgAdminRole = await Role.findOne({ name: "org_admin" });

            let mapping = await UserRoleMapping.findOne({ userId: newOwnerId });

            if (!mapping) {
                mapping = await UserRoleMapping.create({
                    userId: newOwnerId,
                    roleId: orgAdminRole._id,
                    entityType: "organization",
                    entityId: req.params.id,
                    assignedBy: req.user.socialId || "system",
                });
            } else {
                mapping.roleId = orgAdminRole._id;
                mapping.entityType = "organization";
                mapping.entityId = req.params.id;
                mapping.assignedBy = req.user.socialId || "system";
                await mapping.save();
            }
        }



        // No need for permission checks here; checkOrgAccess middleware already did it
        const org = await orgService.updateOrganization(req.params.id, req.body);

        if (!org) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Organization not found",
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization updated successfully",
            data: org,
        });
    } catch (error) {
        return sendErrorResponse({
            res,
            statusCode: 400,
            message: error.message || "Failed to update organization",
            error,
        });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        // No need for permission checks here; checkOrgAccess middleware already did it
        const org = await orgService.deleteOrganization(req.params.id);

        if (!org) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Organization not found",
            });
        }
        return sendResponse({
            res,
            statusCode: 200,
            message: "Organization deleted successfully",
        });
    } catch (error) {
        return sendErrorResponse({
            res,
            message: error.message || "Failed to delete organization",
            error,
        });
    }
};

export const getOrganizationOptions = (req, res) => {
    return sendResponse({
        res,
        statusCode: 200,
        message: "Organization options fetched successfully",
        data: {
            sizes: ORGANIZATION_SIZES,
            types: ORGANIZATION_TYPES,
        },
    });
};
