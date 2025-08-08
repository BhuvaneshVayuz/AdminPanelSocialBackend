import { Team } from "../models/teamModel.js";

export const createTeam = (data) => Team.create(data);

export const getTeams = () => Team.find().populate("sbuId").populate("members");

export const getTeamById = (id) =>
    Team.findById(id).populate("sbuId").populate("members");

export const updateTeamById = (id, data) =>
    Team.findByIdAndUpdate(id, data, { new: true });

export const deleteTeamById = (id) => Team.findByIdAndDelete(id);
