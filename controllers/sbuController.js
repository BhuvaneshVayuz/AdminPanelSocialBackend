// controllers/sbuController.js
import { SBU } from "../models/sbuModel.js";
import { assignRole, removeRole } from "../services/rbacService.js";
import {
    findUserBySocialId,
} from "../services/userService.js";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler.js";

// ✅ Create SBU
export const createSBU = async (req, res) => {
    try {
        const { name, description, websiteUrl, organizationId, leadSocialIds = [] } = req.body;

        const sbu = await SBU.create({
            name,
            description,
            websiteUrl,
            organizationId,
            leadSocialIds,
        });

        // Assign roles to leads
        for (const socialId of leadSocialIds) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await assignRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    orgId: organizationId,
                    sbuId: sbu._id,
                });
            }
        }

        return sendResponse({
            res,
            message: "SBU created successfully",
            data: sbu,
        });
    } catch (err) {
        console.error(err);
        return sendErrorResponse({
            res,
            statusCode: 500,
            message: "Error creating SBU",
            error: err.message,
        });
    }
};

// ✅ Get Single SBU
export const getSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;
        const sbu = await SBU.findById(sbuId).populate("organizationId", "name");
        if (!sbu) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }
        return sendResponse({ res, data: sbu });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

// ✅ Get all SBUs in an org
export const getSBUsByOrg = async (req, res) => {
    try {
        const { orgId } = req.params;
        const sbus = await SBU.find({ organizationId: orgId });
        return sendResponse({ res, data: sbus });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

// ✅ Update SBU
export const updateSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;
        const { name, description, websiteUrl, leadSocialIds = [] } = req.body;

        const sbu = await SBU.findById(sbuId);
        if (!sbu) return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });

        // Track old leads
        const oldLeads = sbu.leadSocialIds || [];

        // Update fields
        sbu.name = name ?? sbu.name;
        sbu.description = description ?? sbu.description;
        sbu.websiteUrl = websiteUrl ?? sbu.websiteUrl;
        sbu.leadSocialIds = leadSocialIds;

        await sbu.save();

        // Reassign roles
        const removedLeads = oldLeads.filter(id => !leadSocialIds.includes(id));
        const newLeads = leadSocialIds.filter(id => !oldLeads.includes(id));

        // Remove roles for removed leads
        for (const socialId of removedLeads) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await removeRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    sbuId: sbu._id,
                });
            }
        }

        // Add roles for new leads
        for (const socialId of newLeads) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await assignRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    orgId: sbu.organizationId,
                    sbuId: sbu._id,
                });
            }
        }

        return sendResponse({
            res,
            message: "SBU updated successfully",
            data: sbu,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

// ✅ Delete SBU
export const deleteSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;

        const sbu = await SBU.findByIdAndDelete(sbuId);
        if (!sbu) return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });

        // Remove lead roles
        for (const socialId of sbu.leadSocialIds) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await removeRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    sbuId: sbu._id,
                });
            }
        }

        return sendResponse({ res, message: "SBU deleted successfully" });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};
