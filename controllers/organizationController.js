import { Role } from "../models/roleModel.js";
import { UserRoleMapping } from "../models/userRoleMappingModel.js";
import * as orgService from "../services/organizationService.js";
import { ORGANIZATION_SIZES, ORGANIZATION_TYPES } from "../utils/index.js";


export const createOrganization = async (req, res) => {
    try {
        const { ownerId, ...orgData } = req.body;

        if (!ownerId) {
            return res.status(400).json({ error: "ownerId (socialId) is required" });
        }

        // 1️⃣ Fetch the "org_admin" role ID
        const orgAdminRole = await Role.findOne({ name: "org_admin" });
        if (!orgAdminRole) {
            return res.status(500).json({ error: "Org Admin role not found" });
        }

        // 2️⃣ Create the organization
        const org = await orgService.createOrganization({
            ...orgData,
            ownerId,
        });

        // 3️⃣ Assign Org Admin role to owner
        await UserRoleMapping.create({
            userId: ownerId,
            roleId: orgAdminRole._id,
            entityType: "organization",
            entityId: org._id,
            assignedBy: req.user.socialId, // superadmin creating the org
        });

        res.status(201).json(org);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};


export const getAllOrganizations = async (req, res) => {
    try {
        const orgs = await orgService.getAllOrganizations();
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const org = await orgService.getOrganizationById(req.params.id);
        if (!org) return res.status(404).json({ message: "Organization not found" });
        res.json(org);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrganization = async (req, res) => {
    try {
        const org = await orgService.updateOrganization(req.params.id, req.body);
        if (!org) return res.status(404).json({ message: "Organization not found" });
        res.json(org);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        const org = await orgService.deleteOrganization(req.params.id);
        if (!org) return res.status(404).json({ message: "Organization not found" });
        res.json({ message: "Organization deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getOrganizationOptions = (req, res) => {
    res.json({
        sizes: ORGANIZATION_SIZES,
        types: ORGANIZATION_TYPES
    });
};