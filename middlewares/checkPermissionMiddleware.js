// middlewares/checkPermission.js
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import { RolePermission } from "../models/rolePermissionModel.js";
import { findParentRole } from "../utils/index.js";
import { Permission } from "../models/permissionModel.js";

/**
 * Middleware to check if a user has a specific permission for an entity
 * @param {String} requiredAction - Permission action (e.g., "org:create", "team:add_member")
 * @param {String} entityType - "organization", "sbu", or "team"
 */
export const checkPermission = (requiredAction, entityType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.socialId;

            // 1️⃣ Fetch all role mappings for the user
            const userMappings = await UserRoleMapping.find({ userId }).populate("roleId");

            if (!userMappings.length) {
                return res.status(403).json({ error: "No roles assigned to this user" });
            }

            // 2️⃣ Check if superadmin
            const isSuperAdmin = userMappings.some(m => m.roleId?.name === "superadmin");
            if (isSuperAdmin) {
                return next();
            }



            // 3️⃣ Handle global actions (no entityId needed)
            const globalActions = ["org:create"];
            if (globalActions.includes(requiredAction)) {
                const roleIds = userMappings.map(m => m.roleId._id);
                const perm = await Permission.findOne({ action: requiredAction }).select("_id");
                const hasGlobalPerm = await RolePermission.exists({
                    roleId: { $in: roleIds },
                    permissionId: perm?._id
                });

                if (hasGlobalPerm) return next();
                return res.status(403).json({ error: "Permission denied" });
            }

            // 4️⃣ Entity-specific checks
            const entityId = req.params.id || req.body.entityId;
            if (!entityId) {
                return res.status(400).json({ error: "Entity ID is required" });
            }

            let roleMapping = await UserRoleMapping.findOne({
                userId,
                entityType,
                entityId,
            });

            if (!roleMapping) {
                roleMapping = await findParentRole(userId, entityType, entityId);
            }

            if (!roleMapping) {
                return res.status(403).json({ error: "No role assigned for this entity" });
            }

            const rolePermissions = await RolePermission.find({
                roleId: roleMapping.roleId,
            }).populate("permissionId");

            const hasPermission = rolePermissions.some(
                (rp) => rp.permissionId?.action === requiredAction
            );

            if (!hasPermission) {
                return res.status(403).json({ error: "Permission denied" });
            }

            req.userRole = {
                roleId: roleMapping.roleId,
                entityType: roleMapping.entityType,
                entityId: roleMapping.entityId,
            };

            next();
        } catch (err) {
            console.error("Permission check error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    };
};
