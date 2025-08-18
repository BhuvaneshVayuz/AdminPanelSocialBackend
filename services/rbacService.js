// services/rbacService.js
import { Role } from "../models/roleModel.js";
import { Permission } from "../models/permissionModel.js";
import { RolePermission } from "../models/rolePermissionModel.js";
import { User } from "../models/userModel.js";

/* ---------------------- ROLE ---------------------- */
export const createRole = async (name, description) => {
    return Role.create({ name, description });
};

export const findRoleByName = async (name) => {
    return Role.findOne({ name }).lean();
};

export const findRoleById = async (roleId) => {
    return Role.findById(roleId).lean();
};

export const getAllRoles = async () => {
    return Role.find().lean();
};

/* ------------------- PERMISSION ------------------- */
export const createPermission = async (action, description) => {
    return Permission.create({ action, description });
};

export const findPermissionByAction = async (action) => {
    return Permission.findOne({ action }).lean();
};

export const findPermissionById = async (permissionId) => {
    return Permission.findById(permissionId).lean();
};

export const getAllPermissions = async () => {
    return Permission.find().lean();
};

/* --------------- ROLE-PERMISSION MAP --------------- */
export const assignPermissionToRole = async (roleId, permissionId) => {
    return RolePermission.create({ roleId, permissionId });
};

export const revokePermissionFromRole = async (roleId, permissionId) => {
    return RolePermission.findOneAndDelete({ roleId, permissionId });
};

/**
 * Check if any role among given roleIds has any of the given permissionIds
 */
export const exists = async ({ roleIds, permissionIds }) => {
    const count = await RolePermission.countDocuments({
        roleId: { $in: roleIds },
        permissionId: { $in: permissionIds },
    });
    return count > 0;
};

/* -------------------- NEW HELPERS -------------------- */

/**
 * Get all permissions for a given role
 */
export const getPermissionsForRole = async (roleId) => {
    const mappings = await RolePermission.find({ roleId }).populate("permissionId", "action description");
    return mappings.map((m) => ({
        id: m.permissionId._id,
        action: m.permissionId.action,
        description: m.permissionId.description,
    }));
};

/**
 * Get all roles that have a specific permission
 */
export const getRolesForPermission = async (permissionId) => {
    const mappings = await RolePermission.find({ permissionId }).populate("roleId", "name description");
    return mappings.map((m) => ({
        id: m.roleId._id,
        name: m.roleId.name,
        description: m.roleId.description,
    }));
};

/**
 * Get full role + permissions mapping
 */
export const getRolesWithPermissions = async () => {
    const roles = await Role.find().lean();

    return Promise.all(
        roles.map(async (role) => {
            const permissions = await getPermissionsForRole(role._id);
            return { ...role, permissions };
        })
    );
};




export const assignRole = async ({ userId, roleName, orgId, sbuId, teamId }) => {
    const role = await findRoleByName(roleName);
    if (!role) throw new Error(`Role ${roleName} not found`);

    await User.findByIdAndUpdate(
        userId,
        {
            $push: {
                roles: {
                    roleId: role._id,
                    orgId,
                    sbuId,
                    teamId,
                },
            },
        },
        { new: true }
    );
};

/**
 * Helper: remove a role from a user
 */
export const removeRole = async ({ userId, roleName, sbuId }) => {
    const role = await findRoleByName(roleName);
    if (!role) return;

    await User.findByIdAndUpdate(
        userId,
        {
            $pull: {
                roles: {
                    roleId: role._id,
                    sbuId,
                },
            },
        },
        { new: true }
    );
};
