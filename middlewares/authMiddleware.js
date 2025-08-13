// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import { sendErrorResponse } from "../utils/responseHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendErrorResponse({
            res,
            statusCode: 401,
            message: "No token provided",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // decoded: { socialId }
        const socialId = decoded.socialId;
        if (!socialId) {
            return sendErrorResponse({
                res,
                statusCode: 401,
                message: "Invalid token payload",
            });
        }

        // Find user's role mapping
        const mapping = await UserRoleMapping.findOne({ userId: socialId })
            .populate("roleId");

        if (!mapping || !mapping.roleId) {
            return sendErrorResponse({
                res,
                statusCode: 403,
                message: "No role assigned to this user",
            });
        }

        const roleName = mapping.roleId.name; // e.g., "superadmin", "org_admin"
        const entityId = mapping.entityId;
        const entityType = mapping.entityType;

        // Prepare enriched req.user
        req.user = {
            socialId,
            role: roleName,
        };

        if (roleName !== "superadmin" && entityType === "organization") {
            req.user.organizationId = entityId.toString();
        }

        next();
    } catch (err) {
        console.error(err);
        return sendErrorResponse({
            res,
            statusCode: 401,
            message: "Invalid or expired token",
            error: err.message,
        });
    }
};
