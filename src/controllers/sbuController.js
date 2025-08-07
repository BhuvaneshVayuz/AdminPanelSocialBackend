import { SBUService } from '../services/sbuService.js';
import { sendResponse, sendErrorResponse } from '../utils/responseHandler.js';

export const getAllSBUs = async (req, res) => {
    try {
        const sbus = await SBUService.getAllSBUs();
        sendResponse({
            res,
            statusCode: 200,
            message: 'SBUs fetched successfully',
            data: sbus,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to fetch SBUs',
            error: err,
        });
    }
};

export const getSBUById = async (req, res) => {
    try {
        const sbu = await SBUService.getSBUById(req.params.id);

        if (!sbu) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'SBU not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'SBU fetched successfully',
            data: sbu,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to fetch SBU',
            error: err,
        });
    }
};

export const createSBU = async (req, res) => {
    try {
        const { name, userIds } = req.body;

        if (!name) {
            return sendErrorResponse({
                res,
                statusCode: 400,
                message: 'Name is required',
            });
        }

        const data = {
            name,
            userIds: Array.isArray(userIds) ? userIds : [],
        };

        const createdSBU = await SBUService.createSBU(data);

        sendResponse({
            res,
            statusCode: 201,
            message: 'SBU created successfully',
            data: createdSBU,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to create SBU',
            error: err,
        });
    }
};

export const updateSBU = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await SBUService.updateSBU(id, data);

        if (!updated) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'SBU not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'SBU updated successfully',
            data: updated,
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to update SBU',
            error: err,
        });
    }
};

export const deleteSBU = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await SBUService.deleteSBU(id);

        if (!deleted) {
            return sendErrorResponse({
                res,
                statusCode: 404,
                message: 'SBU not found',
            });
        }

        sendResponse({
            res,
            statusCode: 200,
            message: 'SBU deleted successfully',
        });
    } catch (err) {
        sendErrorResponse({
            res,
            statusCode: 400,
            message: err?.message || 'Failed to delete SBU',
            error: err,
        });
    }
};
