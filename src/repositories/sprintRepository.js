import Sprint from "../models/sprintModel.js";

export const createSprint = (data) => Sprint.create(data);

export const getAllSprints = () => Sprint.find();

export const getSprintById = (id) => Sprint.findById(id);

export const updateSprint = (id, data) =>
    Sprint.findByIdAndUpdate(id, data, { new: true });

export const deleteSprint = (id) => Sprint.findByIdAndDelete(id);
