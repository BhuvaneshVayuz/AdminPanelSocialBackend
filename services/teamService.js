import {
    createTeam,
    getTeams,
    getTeamById,
    updateTeamById,
    deleteTeamById,
} from "../repositories/teamRepository.js";

export const createTeamService = async (data) => {
    return await createTeam(data);
};

export const getTeamsService = async () => {
    return await getTeams();
};

export const getTeamByIdService = async (id) => {
    return await getTeamById(id);
};

export const updateTeamService = async (id, data) => {
    return await updateTeamById(id, data);
};

export const deleteTeamService = async (id) => {
    return await deleteTeamById(id);
};
