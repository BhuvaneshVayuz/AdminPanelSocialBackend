import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import { Permission } from "../models/permissionModel.js";
import { RolePermission } from "../models/rolePermissionModel.js";
import { Role } from "../models/roleModel.js";
import Organization from "../models/organizationModel.js";

/**
 * Check if user has org_admin role for specific org
 */
const hasOrgAdminAccess = async (userId, orgId) => {
    const orgAdminRole = await Role.findOne({ name: "org_admin" }).select("_id");
    if (!orgAdminRole) return false;

    const mapping = await UserRoleMapping.findOne({
        userId,
        roleId: orgAdminRole._id,
        entityType: "organization",
        entityId: orgId,
    });

    return !!mapping;
};

/**
 * Middleware factory
 */
export const checkOrgAccess = (requiredAction) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.socialId;
            const orgId = req.params.id;

            // Get all roles for this user
            const mappings = await UserRoleMapping.find({ userId }).populate("roleId");
            if (!mappings.length) {
                return res.status(403).json({ error: "No roles assigned" });
            }

            // 1️⃣ Allow superadmin
            if (mappings.some(m => m.roleId?.name === "superadmin")) {
                return next();
            }

            // 2️⃣ Allow org_admin of same org
            if (await hasOrgAdminAccess(userId, orgId)) {
                return next();
            }

            // 3️⃣ Permission check
            const perm = await Permission.findOne({ action: requiredAction }).select("_id");
            if (!perm) {
                return res.status(403).json({ error: "Permission not found" });
            }

            const roleIds = mappings.map(m => m.roleId._id);
            const hasPerm = await RolePermission.exists({
                roleId: { $in: roleIds },
                permissionId: perm._id
            });

            if (!hasPerm) {
                return res.status(403).json({ error: "Permission denied" });
            }

            // 4️⃣ Ownership check
            const org = await Organization.findById(orgId);
            if (!org) {
                return res.status(404).json({ error: "Organization not found" });
            }

            if (org.ownerId?.toString() !== userId) {
                return res.status(403).json({ error: "Not allowed to modify this organization" });
            }

            next();
        } catch (err) {
            console.error("checkOrgAccess error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
};
