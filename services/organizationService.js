import * as orgRepo from "../repositories/organizationRepository.js";

export const createOrganization = async (data) => {
    return await orgRepo.createOrganization(data);
};

export const getAllOrganizations = async () => {
    return await orgRepo.getAllOrganizations();
};

export const getOrganizationById = async (id) => {
    return await orgRepo.getOrganizationById(id);
};

export const updateOrganization = async (id, data) => {
    return await orgRepo.updateOrganization(id, data);
};

export const deleteOrganization = async (id) => {
    return await orgRepo.deleteOrganization(id);
};
