import { SBURepository } from '../repositories/sbuRepository.js';

export const SBUService = {
    createSBU: async (data) => SBURepository.create(data),
    getAllSBUs: async () => SBURepository.findAll(),
    getSBUById: async (id) => SBURepository.findById(id),
    updateSBU: async (id, data) => SBURepository.updateById(id, data),
    deleteSBU: async (id) => SBURepository.deleteById(id),
};
