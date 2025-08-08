import {
    createTeamService,
    getTeamsService,
    getTeamByIdService,
    updateTeamService,
    deleteTeamService,
} from "../services/teamService.js";

import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";

export const createTeamController = async (req, res) => {
    try {
        const { name, sbuId, members } = req.body;

        if (!name || !sbuId) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: 'Team name and SBU ID are required',
            });
        }

        const data = {
            name,
            sbuId,
            members: Array.isArray(members) ? members : [],
        };

        const team = await createTeamService(data);

        sendResponse({
            res,
            statusCode: 201,
            message: 'Team created successfully',
            data: team,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to create team',
            error: err,
        });
    }
};

export const getTeamsController = async (req, res) => {
    try {
        const teams = await getTeamsService();

        sendResponse({
            res,
            statusCode: 200,
            message: 'Teams fetched successfully',
            data: teams,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to fetch teams',
            error: err,
        });
    }
};

export const getTeamByIdController = async (req, res) => {
    try {
        const team = await getTeamByIdService(req.params.id);

        if (!team) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'Team not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'Team fetched successfully',
            data: team,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to fetch team',
            error: err,
        });
    }
};

export const updateTeamController = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateTeamService(id, req.body);

        if (!updated) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'Team not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'Team updated successfully',
            data: updated,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to update team',
            error: err,
        });
    }
};

export const deleteTeamController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteTeamService(id);

        if (!deleted) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'Team not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'Team deleted successfully',
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to delete team',
            error: err,
        });
    }
};
