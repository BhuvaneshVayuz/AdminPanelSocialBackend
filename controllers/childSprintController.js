import { childSprintService } from "../services/childSprintService.js";
import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";

export const getAllChildSprints = async (req, res) => {
    try {
        const sprints = await childSprintService.getAllChildSprints();

        sendResponse({
            res,
            statusCode: 200,
            message: "Child sprints fetched successfully",
            data: sprints,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to fetch child sprints",
            error: err,
        });
    }
};

export const getChildSprintById = async (req, res) => {
    try {
        const sprint = await childSprintService.getChildSprintById(req.params.id);

        if (!sprint) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Child sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Child sprint fetched successfully",
            data: sprint,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to fetch child sprint",
            error: err,
        });
    }
};

export const createChildSprint = async (req, res) => {
    try {
        const { sprintId, name, startDate, endDate, description } = req.body;

        if (!sprintId || !name) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: "Sprint ID and name are required",
            });
        }

        const data = { sprintId, name, startDate, endDate, description };

        const newChildSprint = await childSprintService.createChildSprint(data);

        sendResponse({
            res,
            statusCode: 201,
            message: "Child sprint created successfully",
            data: newChildSprint,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to create child sprint",
            error: err,
        });
    }
};

export const updateChildSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await childSprintService.updateChildSprint(id, data);

        if (!updated) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Child sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Child sprint updated successfully",
            data: updated,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to update child sprint",
            error: err,
        });
    }
};

export const deleteChildSprint = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await childSprintService.deleteChildSprint(id);

        if (!deleted) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Child sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Child sprint deleted successfully",
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to delete child sprint",
            error: err,
        });
    }
};
