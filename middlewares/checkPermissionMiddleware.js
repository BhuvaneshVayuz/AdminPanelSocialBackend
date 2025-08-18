import { sendErrorResponse } from "../utils/responseHandler.js";
import { getUserWithRoles } from "../services/userService.js";
import { getPermissionsForRole } from "../services/rbacService.js";
import { getOrganizationById } from "../services/organizationService.js";
import { getSBUById } from "../services/sbuService.js";
import { getTeamById } from "../services/teamService.js";

const ROLE_HIERARCHY = ["member", "team_lead", "sbu_lead", "org_admin", "superadmin"];

const checkPermission = (action) => {
    return async (req, res, next) => {
        try {
            const user = req.user; // from JWT/session

            const orgId = req.body?.orgId || req.params.orgId || null;
            const sbuId = req.body?.sbuId || req.params.sbuId || null;
            const teamId = req.body?.teamId || req.params.teamId || null;


            // === Superadmin shortcut ===
            if (user.isSuperAdmin) {
                req.context = { orgId, sbuId, teamId };
                return next();
            }

            // === Populate user roles ===
            const { user: populatedUser, roles } = await getUserWithRoles(user._id);
            if (!roles.length) {
                return sendErrorResponse({
                    res,
                    statusCode: 403,
                    message: "No roles assigned. Access forbidden.",
                });
            }

            // === Expand permissions for roles ===
            let allowedRoles = [];
            for (const role of populatedUser.roles) {
                if (!role.roleId) continue;

                const permissions = await getPermissionsForRole(role.roleId._id);
                const allowedActions = permissions.map((p) => p.action);

                if (allowedActions.includes(action)) {
                    allowedRoles.push({
                        roleName: role.roleId.name,
                        orgId: role.orgId,
                        sbuId: role.sbuId,
                        teamId: role.teamId,
                    });
                }
            }

            if (!allowedRoles.length) {
                return sendErrorResponse({
                    res,
                    statusCode: 403,
                    message: "You do not have permission for this action.",
                });
            }

            // Sort roles by strength
            allowedRoles.sort(
                (a, b) =>
                    ROLE_HIERARCHY.indexOf(b.roleName) - ROLE_HIERARCHY.indexOf(a.roleName)
            );

            // === MULTI-ROLE RESOLUTION ===
            let context = { orgId: null, sbuId: null, teamId: null };

            // ORG
            if (orgId) {
                const org = await getOrganizationById(orgId);
                if (!org) return sendErrorResponse({ res, statusCode: 404, message: "Organization not found." });

                const matchingRoles = allowedRoles.filter(r => !r.orgId || String(r.orgId) === String(orgId));
                if (!matchingRoles.length) {
                    return sendErrorResponse({ res, statusCode: 403, message: "You are not part of this organization." });
                }
                context.orgId = orgId;
                allowedRoles = matchingRoles;
            } else {
                const uniqueOrgs = [...new Set(allowedRoles.map(r => r.orgId).filter(Boolean))];




                if (uniqueOrgs.length === 1) {
                    context.orgId = uniqueOrgs[0];
                } else if (uniqueOrgs.length > 1) {
                    return sendErrorResponse({
                        res,
                        statusCode: 400,
                        message: "Multiple organizations found. Please provide orgId explicitly.",
                    });
                }
            }

            // SBU
            if (sbuId) {
                const sbu = await getSBUById(sbuId);
                if (!sbu) return sendErrorResponse({ res, statusCode: 404, message: "SBU not found." });



                if (context.orgId && String(sbu.organizationId) !== String(context.orgId)) {
                    return sendErrorResponse({ res, statusCode: 403, message: "SBU does not belong to organization." });
                }

                const matchingRoles = allowedRoles.filter(r => !r.sbuId || String(r.sbuId) === String(sbuId));
                if (!matchingRoles.length) {
                    return sendErrorResponse({ res, statusCode: 403, message: "You are not part of this SBU." });
                }
                context.sbuId = sbuId;
                allowedRoles = matchingRoles;
            } else {
                const uniqueSbus = [...new Set(allowedRoles.map(r => r.sbuId).filter(Boolean))];
                if (uniqueSbus.length === 1) {
                    context.sbuId = uniqueSbus[0];
                } else if (uniqueSbus.length > 1) {
                    return sendErrorResponse({
                        res,
                        statusCode: 400,
                        message: "Multiple SBUs found. Please provide sbuId explicitly.",
                    });
                }
            }

            // TEAM
            if (teamId) {
                const team = await getTeamById(teamId);
                if (!team) return sendErrorResponse({ res, statusCode: 404, message: "Team not found." });

                if (context.sbuId && String(team.sbuId) !== String(context.sbuId)) {
                    return sendErrorResponse({ res, statusCode: 403, message: "Team does not belong to SBU." });
                }

                const matchingRoles = allowedRoles.filter(r => !r.teamId || String(r.teamId) === String(teamId));
                if (!matchingRoles.length) {
                    return sendErrorResponse({ res, statusCode: 403, message: "You are not part of this team." });
                }
                context.teamId = teamId;
                allowedRoles = matchingRoles;
            } else {
                const uniqueTeams = [...new Set(allowedRoles.map(r => r.teamId).filter(Boolean))];
                if (uniqueTeams.length === 1) {
                    context.teamId = uniqueTeams[0];
                } else if (uniqueTeams.length > 1) {
                    return sendErrorResponse({
                        res,
                        statusCode: 400,
                        message: "Multiple teams found. Please provide teamId explicitly.",
                    });
                }
            }

            req.context = context;



            return next();
        } catch (err) {
            console.error(err);
            return sendErrorResponse({
                res,
                statusCode: err.statusCode || 500,
                message: err.message || "Internal Server Error",
            });
        }
    };
};

export { checkPermission };
