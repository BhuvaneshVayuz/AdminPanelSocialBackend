// services/organizationService.js
import * as orgRepo from "../repositories/organizationRepository.js";


export const createOrganization = async (data) => {
    if (!data.name) {
        throw new Error("Organization name is required");
    }
    if (!data.adminId) {
        throw new Error("Organization adminId is required");
    }

    return await orgRepo.createOrganization(data);
};

export const getAllOrganizations = async () => {
    return await orgRepo.getAllOrganizations();
};

export const getOrganizationsByUser = async (user) => {
    if (!user || !user.id) {
        throw new Error("User details are required");
    }

    // If superadmin → return all orgs
    if (user.role === "superadmin") {
        return await orgRepo.getAllOrganizations();
    }

    // Else return only their orgs
    return await orgRepo.getOrganizationsByUser(user.socialId);
};



export const getOrganizationById = async (id) => {
    const org = await orgRepo.getOrganizationById(id);
    if (!org) {
        throw new Error("Organization not found");
    }
    return org;
};


export const updateOrganization = async (id, data) => {
    const updated = await orgRepo.updateOrganization(id, data);
    if (!updated) {
        throw new Error("Organization update failed or not found");
    }
    return updated;
};

export const deleteOrganization = async (id) => {
    const deleted = await orgRepo.deleteOrganization(id);
    if (!deleted) {
        throw new Error("Organization deletion failed or not found");
    }
    return deleted;
};
