import { ChildSprint } from "../models/childSprintModel.js";

export const childSprintRepo = {
    create: (data) => ChildSprint.create(data),

    getAll: () => ChildSprint.find().populate("sprintId"),

    getById: (id) => ChildSprint.findById(id).populate("sprintId"),

    updateById: (id, data) =>
        ChildSprint.findByIdAndUpdate(id, data, { new: true }),

    deleteById: (id) => ChildSprint.findByIdAndDelete(id),
};
