import { SBU } from '../models/sbuModel.js';

export const SBURepository = {
    create: (data) => SBU.create(data),
    findAll: () => SBU.find(),
    findById: (id) => SBU.findById(id),
    updateById: (id, data) => SBU.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id) => SBU.findByIdAndDelete(id),
};
