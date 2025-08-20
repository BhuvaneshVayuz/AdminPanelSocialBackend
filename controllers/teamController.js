// controllers/teamController.js
import { sendErrorResponse, sendResponse } from "../utils/responseHandler.js";
import * as userService from "../services/userService.js";
import * as rbacService from "../services/rbacService.js";
import * as teamService from "../services/teamService.js";

/* ------------------ CREATE TEAM ------------------ */
export const createTeam = async (req, res) => {
    try {
        const { name, teamLeadId, members } = req.body;

        // ✅ Prefer org/sbu from checkPermission middleware (req.context)
        const organizationId = req.context?.orgId || req.body.organizationId || null;
        const sbuId = req.context?.sbuId || req.body.sbuId || null;

        if (!organizationId) {
            return sendErrorResponse({ res, statusCode: 400, message: "OrganizationId is required." });
        }
        if (!sbuId) {
            return sendErrorResponse({ res, statusCode: 400, message: "SBUId is required." });
        }

        const team = await teamService.createTeam({
            name,
            organizationId,
            sbuId,
            teamLeadId: teamLeadId || null,
            members: members || [],
        });

        // ✅ Assign roles (via RBAC service)
        if (teamLeadId) {
            const lead = await userService.findUserBySocialId(teamLeadId);
            if (!lead) {
                return sendErrorResponse({ res, statusCode: 404, message: "Team lead not found" });
            }

            await rbacService.assignRole({
                userId: lead._id,
                roleName: "team_lead",
                orgId: organizationId,
                sbuId,
                teamId: team._id,
            });
        }

        if (members?.length) {
            for (const socialId of members) {
                const member = await userService.findUserBySocialId(socialId);
                if (member) {
                    await rbacService.assignRole({
                        userId: member._id,
                        roleName: "member",
                        orgId: organizationId,
                        sbuId,
                        teamId: team._id,
                    });
                }
            }
        }

        return sendResponse({ res, statusCode: 201, message: "Team created", data: team });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ GET TEAM ------------------ */
export const getTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await teamService.getTeamById(teamId);

        return sendResponse({ res, statusCode: 200, data: team });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ UPDATE TEAM ------------------ */
export const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, teamLeadId, members } = req.body;

        const team = await teamService.getTeamById(teamId);

        if (name) team.name = name;

        // ✅ Handle teamLead changes
        if (teamLeadId && teamLeadId !== team.teamLeadId) {
            // Remove old lead role
            if (team.teamLeadId) {
                const oldLead = await userService.findUserBySocialId(team.teamLeadId);
                if (oldLead) {
                    await rbacService.removeRole({
                        userId: oldLead._id,
                        roleName: "team_lead",
                        teamId,
                    });
                }
            }

            // Assign new lead
            const newLead = await userService.findUserBySocialId(teamLeadId);
            if (!newLead) {
                return sendErrorResponse({ res, statusCode: 404, message: "New team lead not found" });
            }

            await rbacService.assignRole({
                userId: newLead._id,
                roleName: "team_lead",
                orgId: team.organizationId,
                sbuId: team.sbuId,
                teamId,
            });

            team.teamLeadId = teamLeadId;
        }

        // ✅ Handle members update
        if (members) {
            // Remove roles from old members not in new list
            for (const oldMember of team.members) {
                if (!members.includes(oldMember)) {
                    const user = await userService.findUserBySocialId(oldMember);
                    if (user) {
                        await rbacService.removeRole({
                            userId: user._id,
                            roleName: "member",
                            teamId,
                        });
                    }
                }
            }

            // Add roles for new members
            for (const newMember of members) {
                if (!team.members.includes(newMember)) {
                    const user = await userService.findUserBySocialId(newMember);
                    if (user) {
                        await rbacService.assignRole({
                            userId: user._id,
                            roleName: "member",
                            orgId: team.organizationId,
                            sbuId: team.sbuId,
                            teamId,
                        });
                    }
                }
            }

            team.members = members;
        }

        const updatedTeam = await teamService.updateTeam(teamId, team);

        return sendResponse({ res, statusCode: 200, message: "Team updated", data: updatedTeam });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ DELETE TEAM ------------------ */
export const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await teamService.getTeamById(teamId);

        // ✅ Cleanup roles
        if (team.teamLeadId) {
            const lead = await userService.findUserBySocialId(team.teamLeadId);
            if (lead) {
                await rbacService.removeRole({ userId: lead._id, roleName: "team_lead", teamId });
            }
        }

        for (const memberId of team.members) {
            const user = await userService.findUserBySocialId(memberId);
            if (user) {
                await rbacService.removeRole({ userId: user._id, roleName: "member", teamId });
            }
        }

        await teamService.deleteTeam(teamId);

        return sendResponse({ res, statusCode: 200, message: "Team deleted", data: team });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};

/* ------------------ LIST TEAMS IN SBU ------------------ */
export const listTeams = async (req, res) => {
    try {
        const { orgId } = req.context; // ✅ populated by checkPermission middleware

        let teams;




        if (req?.user?.isSuperAdmin) {
            // ✅ Superadmin gets everything
            teams = await teamService.getAllTeams();
        } else {
            if (!orgId) {
                return sendErrorResponse({ res, statusCode: 400, message: "Organization context is required." });
            }
            teams = await teamService.getTeamsByOrg(orgId);
        }

        return sendResponse({ res, statusCode: 200, data: teams });
    } catch (err) {
        return sendErrorResponse({ res, statusCode: 500, message: err.message });
    }
};
