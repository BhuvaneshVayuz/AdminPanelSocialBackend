import { User } from "../models/userModel.js";

/**
 * Find a user by socialId
 */
export const findUserBySocialId = async (socialId) => {
    return await User.findOne({ socialId });
};


export const getUserById = async (userId) => {
    return await User.findById(userId);
};

/**
 * Create a new user
 */
export const createUser = async ({ socialId, name, email, department }) => {
    const user = new User({
        socialId,
        name,
        email,
        department,
        roles: [], // initially empty
    });
    return await user.save();
};

/**
 * Get user with roles (joined with Role documents)
 */
export const getUserWithRoles = async (userId) => {
    // Load user and populate roleId inside roles array
    const user = await User.findById(userId).populate("roles.roleId", "name");
    if (!user) return null;

    // Map roles to flatten role info (so controller doesn’t need to query Role again)
    const roles = user.roles.map((r) => ({
        roleName: r.roleId?.name || null,
        orgId: r.orgId || null,
        sbuId: r.sbuId || null,
        teamId: r.teamId || null,
    }));

    return { user, roles };
};

/**
 * Upsert user by socialId (used if you want to create or fetch existing)
 */
export const upsertUserBySocialId = async ({ socialId, name, email, department }) => {
    let user = await User.findOne({ socialId });

    if (!user) {
        user = new User({
            socialId,
            name,
            email,
            department,
        });
        await user.save();
    }

    return user;
};



export const removeRolesByFilter = async (filter) => {
    // Build query to match roles inside the roles array
    const query = {};
    if (filter.orgId) query["roles.orgId"] = filter.orgId;
    if (filter.sbuId) query["roles.sbuId"] = filter.sbuId;
    if (filter.teamId) query["roles.teamId"] = filter.teamId;

    // Find all users that have roles matching the filter
    const users = await User.find(query);

    for (const user of users) {
        // Keep only roles that DO NOT match the filter
        user.roles = user.roles.filter((role) => {
            if (filter.orgId && role.orgId?.toString() !== filter.orgId.toString()) return true;
            if (filter.sbuId && role.sbuId?.toString() !== filter.sbuId.toString()) return true;
            if (filter.teamId && role.teamId?.toString() !== filter.teamId.toString()) return true;

            // if role matches filter, drop it
            return false;
        });
        await user.save();
    }

    return { modifiedCount: users.length };
};