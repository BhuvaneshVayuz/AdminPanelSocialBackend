import { childSprintRepo } from "../repositories/childSprintRepository.js";

export const childSprintService = {
    createChildSprint: (data) => childSprintRepo.create(data),

    getAllChildSprints: () => childSprintRepo.getAll(),

    getChildSprintById: (id) => childSprintRepo.getById(id),

    updateChildSprint: (id, data) => childSprintRepo.updateById(id, data),

    deleteChildSprint: (id) => childSprintRepo.deleteById(id),
};
