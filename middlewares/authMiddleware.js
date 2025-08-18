import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/responseHandler.js";
import { getUserById } from "../services/userService.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendErrorResponse({
                res,
                statusCode: 401,
                message: "Authorization token missing or malformed",
            });
        }

        const token = authHeader.split(" ")[1];

        // 🔹 Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return sendErrorResponse({
                res,
                statusCode: 401,
                message: "Invalid token",
            });
        }

        const user = await getUserById(decoded.userId);
        if (!user) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "User not found",
            });
        }

        req.userId = decoded.userId;
        req.user = user;


        next();
    } catch (error) {
        return sendErrorResponse({
            res,
            statusCode: 401,
            message: "Unauthorized - Token invalid or expired",
            error: error.message,
        });
    }
};
