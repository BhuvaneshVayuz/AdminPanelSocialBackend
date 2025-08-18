// controllers/sbuController.js
import * as sbuService from "../services/sbuService.js";
import { assignRole, removeRole } from "../services/rbacService.js";
import { findUserBySocialId } from "../services/userService.js";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler.js";

// ✅ Create SBU
export const createSBU = async (req, res) => {
    try {
        const { name, description, websiteUrl, organizationId, leadSocialIds = [] } = req.body;
        let orgIdtemp = organizationId
        if (!orgIdtemp) {
            orgIdtemp = req?.context?.orgId
        }


        const sbu = await sbuService.createSBU({
            name,
            description,
            websiteUrl,
            organizationId: orgIdtemp,
            leadSocialIds,
        });

        // Assign roles to leads
        for (const socialId of leadSocialIds) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await assignRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    orgId: orgIdtemp,
                    sbuId: sbu._id,
                });
            }
        }

        return sendResponse({
            res,
            statusCode: 201, // Created
            message: "SBU created successfully",
            data: sbu,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

// ✅ Get Single SBU
export const getSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;
        const sbu = await sbuService.getSBUById(sbuId);

        if (!sbu) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }

        return sendResponse({ res, statusCode: 200, data: sbu });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

// ✅ Get all SBUs in an org
export const getSBUsByOrg = async (req, res) => {
    try {
        const { orgId } = req.context || {};

        if (!orgId) {
            // If no orgId in context, check superadmin
            if (req.user?.isSuperAdmin) {
                const allSBUs = await sbuService.getAllSBUs();
                return sendResponse({ res, statusCode: 200, data: allSBUs });
            }
            return sendErrorResponse({
                res,
                statusCode: 403,
                message: "Organization context not found.",
            });
        }

        // Normal case: fetch SBUs for orgId in context
        const sbus = await sbuService.getSBUsByOrg(orgId);
        return sendResponse({ res, statusCode: 200, data: sbus });

    } catch (err) {
        console.error("Error in getSBUsByOrg:", err);
        return sendErrorResponse({
            res,
            statusCode: 500,
            message: err.message,
        });
    }
};

// ✅ Update SBU
export const updateSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;
        const { name, description, websiteUrl, leadSocialIds } = req.body;

        const sbu = await sbuService.getSBUById(sbuId);
        if (!sbu) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }

        const oldLeads = sbu.leadSocialIds || [];

        // Build update object dynamically
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
        if (leadSocialIds !== undefined) updateData.leadSocialIds = leadSocialIds;

        const updatedSBU = await sbuService.updateSBU(sbuId, updateData);

        // Handle lead role changes only if leadSocialIds was sent
        if (leadSocialIds !== undefined) {
            const removedLeads = oldLeads.filter(id => !leadSocialIds.includes(id));
            const newLeads = leadSocialIds.filter(id => !oldLeads.includes(id));

            for (const socialId of removedLeads) {
                const user = await findUserBySocialId(socialId);
                if (user) {
                    await removeRole({
                        userId: user._id,
                        roleName: "sbu_lead",
                        sbuId: sbuId,
                    });
                }
            }

            for (const socialId of newLeads) {
                const user = await findUserBySocialId(socialId);
                if (user) {
                    await assignRole({
                        userId: user._id,
                        roleName: "sbu_lead",
                        orgId: updatedSBU.organizationId,
                        sbuId: updatedSBU._id,
                    });
                }
            }
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: "SBU updated successfully",
            data: updatedSBU,
        });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};


// ✅ Delete SBU
export const deleteSBU = async (req, res) => {
    try {
        const { sbuId } = req.params;

        const sbu = await sbuService.getSBUById(sbuId);
        if (!sbu) {
            return sendErrorResponse({ res, statusCode: 404, message: "SBU not found" });
        }



        await sbuService.deleteSBU(sbuId);

        for (const socialId of sbu.leadSocialIds || []) {
            const user = await findUserBySocialId(socialId);
            if (user) {
                await removeRole({
                    userId: user._id,
                    roleName: "sbu_lead",
                    sbuId: sbu._id,
                });
            }
        }

        return sendResponse({ res, statusCode: 200, message: "SBU deleted successfully" });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};
