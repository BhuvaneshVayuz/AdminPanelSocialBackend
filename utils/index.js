// utils/findParentRole.js
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import { Team } from "../models/teamModel.js";
import { SBU } from "../models/sbuModel.js";

/**
 * Find a role mapping for parent entities when a direct mapping is not found.
 * Supports climbing:
 * team → sbu → organization
 * sbu → organization
 */
// utils/findParentRole.js

export const findParentRole = async (userId, entityType, entityId) => {
    try {
        let parentMapping = null;

        if (entityType === "team") {
            const team = await Team.findById(entityId).lean();
            if (!team) return null;

            // Check SBU role
            parentMapping = await UserRoleMapping.findOne({
                userId,
                entityType: "sbu",
                entityId: team.sbuId,
            });
            if (parentMapping) return parentMapping;

            // Check Organization role
            parentMapping = await UserRoleMapping.findOne({
                userId,
                entityType: "organization",
                entityId: team.organizationId,
            });
            if (parentMapping) return parentMapping;
        }

        if (entityType === "sbu") {
            const sbu = await SBU.findById(entityId).lean();
            if (!sbu) return null;

            // Check Organization role
            parentMapping = await UserRoleMapping.findOne({
                userId,
                entityType: "organization",
                entityId: sbu.organizationId,
            });
            if (parentMapping) return parentMapping;
        }

        return null;
    } catch (err) {
        console.error("findParentRole error:", err);
        return null;
    }
};




export const ORGANIZATION_SIZES = [
    "0-1",
    "2-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10000",
    "10000+"
];

export const ORGANIZATION_TYPES = [
    "Public company",
    "Self employed",
    "Government Agency",
    "Nonprofit",
    "Privately Held",
    "Partnership"
];
