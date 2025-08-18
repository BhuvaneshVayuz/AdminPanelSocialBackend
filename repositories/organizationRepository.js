import Organization from "../models/organizationModel.js";

export const createOrganization = (data) => Organization.create(data);

export const getAllOrganizations = () => Organization.find();

export const getOrganizationById = (id) => Organization.findById(id);

export const updateOrganization = (id, data) =>
    Organization.findByIdAndUpdate(id, data, { new: true });

export const deleteOrganization = (id) => Organization.findByIdAndDelete(id);



export const getOrganizationsByUser = (userId) => {



    return Organization.find({ adminId: userId });
};
