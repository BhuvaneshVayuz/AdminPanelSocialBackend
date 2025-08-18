import axios from "axios";
import jwt from "jsonwebtoken";
import { sendErrorResponse, sendResponse } from "../utils/responseHandler.js";
import {
    findUserBySocialId,
    createUser,
    getUserWithRoles,
} from "../services/userService.js";
import {
    getPermissionsForRole,
} from "../services/rbacService.js";

const PROFILE_BACKEND_URL = "https://profilebackend.vayuz.com/users/api/signin";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRY = "24h";

export const login = async (req, res) => {
    try {
        const { socialId, authenticationCode } = req.body;

        if (!socialId || !authenticationCode) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: "socialId and authenticationCode are required",
            });
        }

        // 🔹 Step 1: Validate credentials with Profile Backend
        const { data } = await axios.post(PROFILE_BACKEND_URL, {
            adminlogin: false,
            email: socialId,
            password: authenticationCode,
            requestfrom: "social",
        });

        if (data.code < 200 || data.code >= 300) {
            return sendErrorResponse({
                res,
                statusCode: 401,
                message: "Invalid credentials",
            });
        }

        // 🔹 Step 2: Check if user exists in DB
        let user = await findUserBySocialId(socialId);

        if (!user) {
            // Create user in DB but deny login (no roles yet)
            user = await createUser({
                socialId,
                name: data?.data?.name || "Unnamed User",
                email: data?.data?.email || "",
                department: data?.data?.department || null,
            });

            return sendErrorResponse({
                res,
                statusCode: 403,
                message: "User created in system but has no roles assigned. Contact admin.",
            });
        }

        // 🔹 Step 3: Load user with roles populated
        const { user: populatedUser, roles } = await getUserWithRoles(user._id);

        if (!roles.length) {
            return sendErrorResponse({
                res,
                statusCode: 403,
                message: "User has no roles assigned. Contact admin.",
            });
        }

        // (Optional 🔹 Step 3b: also fetch permissions for each role)
        const rolePermissions = {};
        for (const r of populatedUser.roles) {
            if (r.roleId) {
                const perms = await getPermissionsForRole(r.roleId._id);
                rolePermissions[r.roleId.name] = perms;
            }
        }

        // 🔹 Step 4: Generate JWT with only userId
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: populatedUser._id,
                    socialId: populatedUser.socialId,
                    name: populatedUser.name,
                    email: populatedUser.email,
                    department: populatedUser.department,
                    roles,
                    // permissions: rolePermissions, 
                },
            },
        });
    } catch (error) {
        console.error(error);
        return sendErrorResponse({
            res,
            message: error.message || "Server error",
            error,
        });
    }
};
