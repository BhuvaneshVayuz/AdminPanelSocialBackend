import * as sprintRepo from "../repositories/sprintRepository.js";

export const createSprint = async (data) => {
    return await sprintRepo.createSprint(data);
};

export const getAllSprints = async () => {
    return await sprintRepo.getAllSprints();
};

export const getSprintById = async (id) => {
    return await sprintRepo.getSprintById(id);
};

export const updateSprint = async (id, data) => {
    return await sprintRepo.updateSprint(id, data);
};

export const deleteSprint = async (id) => {
    return await sprintRepo.deleteSprint(id);
};
