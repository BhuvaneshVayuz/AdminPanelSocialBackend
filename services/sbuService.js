// services/sbuService.js
import { SBURepository } from '../repositories/sbuRepository.js';
export const createSBU = async (data) => {
    if (!data.name) {
        throw new Error("SBU name is required");
    }
    if (!data.organizationId) {
        throw new Error("organizationId is required");
    }

    return await SBURepository.create(data);
};

export const getAllSBUs = async (filter = {}) => {
    return await SBURepository.findAll(filter);
};

export const getSBUById = async (id) => {
    const sbu = await SBURepository.findById(id);
    if (!sbu) {
        throw new Error("SBU not found");
    }
    return sbu;
};

export const updateSBU = async (id, data) => {
    const updated = await SBURepository.updateById(id, data);
    if (!updated) {
        throw new Error("SBU update failed or not found");
    }
    return updated;
};

export const deleteSBU = async (id) => {
    const deleted = await SBURepository.deleteById(id);
    if (!deleted) {
        throw new Error("SBU deletion failed or not found");
    }
    return deleted;
};

export const getSBUsByOrg = async (orgId) => {
    if (!orgId) {
        throw new Error("Organization ID is required");
    }
    return await SBURepository.findByOrganization(orgId);
};
