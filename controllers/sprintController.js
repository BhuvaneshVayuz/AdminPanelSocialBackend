import * as sprintService from "../services/sprintService.js";
import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";

export const getAllSprints = async (req, res) => {
    try {
        const sprints = await sprintService.getAllSprints();

        sendResponse({
            res,
            statusCode: 200,
            message: "Sprints fetched successfully",
            data: sprints,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to fetch sprints",
            error: err,
        });
    }
};

export const getSprintById = async (req, res) => {
    try {
        const sprint = await sprintService.getSprintById(req.params.id);

        if (!sprint) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Sprint fetched successfully",
            data: sprint,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to fetch sprint",
            error: err,
        });
    }
};

export const createSprint = async (req, res) => {
    try {
        const { name, startDate, endDate, description, projectId } = req.body;

        if (!name || !projectId) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: "Name and Project ID are required",
            });
        }

        const data = { name, startDate, endDate, description, projectId };

        const sprint = await sprintService.createSprint(data);

        sendResponse({
            res,
            statusCode: 201,
            message: "Sprint created successfully",
            data: sprint,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to create sprint",
            error: err,
        });
    }
};

export const updateSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const sprint = await sprintService.updateSprint(id, data);

        if (!sprint) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Sprint updated successfully",
            data: sprint,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to update sprint",
            error: err,
        });
    }
};

export const deleteSprint = async (req, res) => {
    try {
        const { id } = req.params;

        const sprint = await sprintService.deleteSprint(id);

        if (!sprint) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: "Sprint not found",
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: "Sprint deleted successfully",
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || "Failed to delete sprint",
            error: err,
        });
    }
};