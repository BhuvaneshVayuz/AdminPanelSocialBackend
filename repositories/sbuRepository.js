import { SBU } from "../models/sbuModel.js";

export const SBURepository = {
    create: (data) => SBU.create(data),

    findAll: (filter = {}) => SBU.find(filter),

    findById: (id) => SBU.findById(id),

    updateById: (id, data) =>
        SBU.findByIdAndUpdate(id, data, { new: true }),

    deleteById: (id) => SBU.findByIdAndDelete(id),

    findByOrganization: (orgId) =>
        SBU.find({ organizationId: orgId }),
};
