// middlewares/checkSbuAccessMiddleware.js
import { SBU } from "../models/sbuModel.js";
import { sendErrorResponse } from "../utils/responseHandler.js";

export const checkSBUOwnership = async (req, res, next) => {
    try {
        const sbu = await SBU.findById(req.params.id);
        if (!sbu) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "SBU not found",
            });
        }

        // Allow if superadmin or if organization matches
        if (
            req.user.role !== "superadmin" &&
            sbu.organizationId?.toString() !== req.user.organizationId
        ) {
            return sendErrorResponse({
                res,
                statusCode: 403,
                message: "Not authorized to modify this SBU",
            });
        }

        req.sbu = sbu; // Store for controller usage
        next();
    } catch (err) {
        return sendErrorResponse({
            res,
            statusCode: 500,
            message: err.message,
        });
    }
};
