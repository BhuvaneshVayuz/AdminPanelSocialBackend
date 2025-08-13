// controllers/sbuController.js
import { SBUService } from "../services/sbuService.js";
import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import { Role } from "../models/roleModel.js";
import mongoose from "mongoose";

const isSuperAdmin = (role) => role === "superadmin";
const isOrgAdmin = (role) => role === "org_admin";


export const getAllSBUs = async (req, res) => {
    try {

        const filter = isSuperAdmin(req.user.role)
            ? {}
            : { organizationId: new mongoose.Types.ObjectId(req.user.organizationId) };

        const sbus = await SBUService.getAllSBUs(filter);
        sendResponse({ res, statusCode: 200, message: "SBUs fetched successfully", data: sbus });
    } catch (err) {
        sendErrorResponse({ res, statusCode: 400, message: err?.message || "Failed to fetch SBUs", error: err });
    }
};

export const getSBUById = async (req, res) => {
    try {

        const sbu = await SBUService.getSBUById(req.params.id);
        if (!sbu) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }
        if (isOrgAdmin(req.user.role) && sbu.organizationId.toString() !== req.user.organizationId) {
            return sendErrorResponse({ res, statusCode: 403, message: "Not authorized to access this SBU" });
        }
        sendResponse({ res, statusCode: 200, message: "SBU fetched successfully", data: sbu });
    } catch (err) {
        sendErrorResponse({ res, statusCode: 400, message: err?.message || "Failed to fetch SBU", error: err });
    }
};

export const createSBU = async (req, res) => {
    try {

        let { name, sbuLeadId, description, websiteUrl, organizationId } = req.body;
        if (!name) {
            return sendErrorResponse({ res, statusCode: 400, message: "Name is required" });
        }

        if (isOrgAdmin(req.user.role)) {
            organizationId = req.user.organizationId;
        } else if (isSuperAdmin(req.user.role) && !organizationId) {
            return sendErrorResponse({ res, statusCode: 400, message: "organizationId is required for super admin" });
        }

        const createdSBU = await SBUService.createSBU({
            name,
            sbuLeadId,
            description,
            websiteUrl,
            organizationId: new mongoose.Types.ObjectId(organizationId),
        });

        sendResponse({ res, statusCode: 201, message: "SBU created successfully", data: createdSBU });
    } catch (err) {
        sendErrorResponse({ res, statusCode: 400, message: err?.message || "Failed to create SBU", error: err });
    }
};

export const updateSBU = async (req, res) => {
    try {

        const { id } = req.params;
        const existingSBU = await SBUService.getSBUById(id);
        if (!existingSBU) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }
        if (isOrgAdmin(req.user.role) && existingSBU.organizationId.toString() !== req.user.organizationId) {
            return sendErrorResponse({ res, statusCode: 403, message: "Not authorized to update this SBU" });
        }

        const { name, sbuLeadId, description, websiteUrl, organizationId } = req.body;

        const updated = await SBUService.updateSBU(id, {
            ...(name && { name }),
            ...(sbuLeadId && { sbuLeadId }),
            ...(description && { description }),
            ...(websiteUrl && { websiteUrl }),
            ...(isSuperAdmin(req.user.role) && organizationId && { organizationId }), // No casting needed
        });

        sendResponse({ res, statusCode: 200, message: "SBU updated successfully", data: updated });
    } catch (err) {
        sendErrorResponse({ res, statusCode: 400, message: err?.message || "Failed to update SBU", error: err });
    }
};

export const deleteSBU = async (req, res) => {
    try {
        await enrichUserWithRole(req);

        const { id } = req.params;
        const existingSBU = await SBUService.getSBUById(id);
        if (!existingSBU) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }
        if (isOrgAdmin(req.user.role) && existingSBU.organizationId.toString() !== req.user.organizationId) {
            return sendErrorResponse({ res, statusCode: 403, message: "Not authorized to delete this SBU" });
        }

        await SBUService.deleteSBU(id);
        sendResponse({ res, statusCode: 200, message: "SBU deleted successfully" });
    } catch (err) {
        sendErrorResponse({ res, statusCode: 400, message: err?.message || "Failed to delete SBU", error: err });
    }
};
