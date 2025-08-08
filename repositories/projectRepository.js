// repositories/projectRepository.js
import Project from "../models/projectModel.js";

export const findProjectByNameRepo = async (name) => {
  return await Project.findOne({ name: name });
};
export const createProjectRepo = async (projectData) => {
  const project = new Project(projectData);
  return await project.save();
};

export const getProjectByIdRepo = async (id) => {
  const project = await Project.findById(id);
  console.log(project, "project");
  if (!project) {
    throw new Error("Project Not found");
  }
  return project;
};

export const getAllProjectRepo = async () => {
  const projects = await Project.find();
  return projects;
};

export const deleteProjectByIdRepo = async (id) => {
  const deleted = await Project.findByIdAndDelete(id);
  return deleted;
};
