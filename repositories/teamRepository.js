import { Team } from "../models/teamModel.js";

export const createTeam = (data) => Team.create(data);

export const getTeams = () =>
    Team.find()
        .populate("organizationId")
        .populate("sbuId")
        .populate("teamLeadId")
        .populate("members");

export const getTeamById = (id) =>
    Team.findById(id)
        .populate("organizationId")
        .populate("sbuId")
        .populate("teamLeadId")
        .populate("members");

export const updateTeamById = (id, data) =>
    Team.findByIdAndUpdate(id, data, { new: true })
        .populate("organizationId")
        .populate("sbuId")
        .populate("teamLeadId")
        .populate("members");

export const deleteTeamById = (id) => Team.findByIdAndDelete(id);

// ✅ New: generic update (for member add/remove, etc.)
export const findTeamByIdAndUpdate = (id, update) =>
    Team.findByIdAndUpdate(id, update, { new: true })
        .populate("organizationId")
        .populate("sbuId")
        .populate("teamLeadId")
        .populate("members");

// ✅ New: get teams by SBU
export const getTeamsBySbu = (sbuId) =>
    Team.find({ sbuId })
        .populate("organizationId")
        .populate("sbuId")
        .populate("teamLeadId")
        .populate("members");
