import mongoose from "mongoose";
import {
  createProjectRepo,
  deleteProjectByIdRepo,
  findProjectByNameRepo,
  getAllProjectRepo,
  getProjectByIdRepo,
} from "../repositories/projectRepository.js";
import { createError } from "../utils/responseHandler.js";

export const createProjectService = async (data) => {
  const existingProject = await findProjectByNameRepo(data?.name);
  if (existingProject) {
    throw new Error("Project with this name already exist");
  }
  // Optional: Add business rules/validations here
  return await createProjectRepo(data);
};

export const getProjectByIdService = async (id) => {
  console.log(id, "id from service");
  return await getProjectByIdRepo(id);
};

export const getAllProjectService = async () => {
  return await getAllProjectRepo();
};

export const deleteProjectByIdService = async (id) => {
  return await deleteProjectByIdRepo(id);
};
