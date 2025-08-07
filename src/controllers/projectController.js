import mongoose from "mongoose";
import {
  createProjectService,
  deleteProjectByIdService,
  getAllProjectService,
  getProjectByIdService,
} from "../services/projectService.js";
import {
  createError,
  sendErrorResponse,
  sendResponse,
} from "../utils/responseHandler.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjectService();
    sendResponse({
      res,
      statusCode: 200,
      message: "projects fetched!!",
      data: projects,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      statusCode: error?.statusCode || 400,
      message: "Something went wrong while fetching the projects",
      error: error?.message,
    });
  }
};

const validateProject = (data) => {
  console.log(data, "data");
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Project name is required.");
  }

  if (!data.startDate || !data.endDate) {
    errors.push("Start date and end date are required.");
  } else {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start > end) {
      errors.push("Start date cannot be after end date.");
    }
  }

  return errors;
};

export const createProject = async (req, res) => {
  try {
    const errors = validateProject(req.body);
    console.log(errors, "erros");
    if (errors.length > 0) {
      sendErrorResponse({
        res,
        statusCode: 400,
        message: "Error while creating project",
        error: errors,
      });
    }

    const newProject = await createProjectService(req.body);
    sendResponse({
      res,
      statusCode: 201,
      message: "Project created Successfully",
      data: newProject,
    });
  } catch (error) {
    console.log("error", error);
    sendErrorResponse({
      res,
      statusCode: 400,
      message: "Error while creating project",
      error: error?.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(404, "Invalid Project ID");
    }
    if (!id) {
      return sendErrorResponse({
        res,
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const project = await getProjectByIdService(id);
    if (!project) {
      return sendErrorResponse({
        res,
        statusCode: 404,
        message: "Project not found",
      });
    }
    sendResponse({
      res,
      statusCode: 200,
      message: "Project fetched!",
      data: project,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      statusCode: error?.statusCode || 400,
      message: "Something went wrong while fetching the project",
      error: error?.message,
    });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(404, "Invalid Project ID");
    }

    const deletedProject = await deleteProjectByIdService(id);

    if (!deletedProject) {
      throwError("Project not found", 404);
    }
    sendResponse({ res, statusCode: 200, message: "Project Deleted" });
  } catch (error) {
    sendErrorResponse({
      res,
      statusCode: error?.statusCode || 400,
      message: "Something went wrong while delete the project",
      error: error?.message,
    });
  }
};
