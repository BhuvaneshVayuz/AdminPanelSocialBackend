// services/teamService.js
import * as teamRepo from "../repositories/teamRepository.js";

export const createTeam = async (data) => {
    if (!data.name) {
        throw new Error("Team name is required");
    }
    if (!data.sbuId) {
        throw new Error("SBU ID is required");
    }

    return await teamRepo.createTeam(data);
};

export const getAllTeams = async () => {
    return await teamRepo.getTeams();
};

export const getTeamById = async (id) => {
    const team = await teamRepo.getTeamById(id);
    if (!team) {
        throw new Error("Team not found");
    }
    return team;
};

export const updateTeam = async (id, data) => {
    const updated = await teamRepo.updateTeamById(id, data);
    if (!updated) {
        throw new Error("Team update failed or not found");
    }
    return updated;
};

export const deleteTeam = async (id) => {
    const deleted = await teamRepo.deleteTeamById(id);
    if (!deleted) {
        throw new Error("Team deletion failed or not found");
    }
    return deleted;
};

// ✅ find and update
export const findTeamByIdAndUpdate = async (id, update) => {
    const team = await teamRepo.findTeamByIdAndUpdate(id, update);
    if (!team) {
        throw new Error("Team not found for update");
    }
    return team;
};

// ✅ get teams by SBU
export const getTeamsBySbu = async (sbuId) => {
    if (!sbuId) {
        throw new Error("SBU ID is required");
    }
    return await teamRepo.getTeamsBySbu(sbuId);
};

export const getTeamsByOrg = async (orgId) => {
    return teamRepo.findTeamsByOrg(orgId);
};