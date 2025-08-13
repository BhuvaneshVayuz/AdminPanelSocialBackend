// models/organizationModel.js
import mongoose from "mongoose";
import { ORGANIZATION_SIZES, ORGANIZATION_TYPES } from "../utils/index.js";

const organizationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        industry: { type: String },
        website_url: { type: String },
        size: {
            type: String,
            enum: ORGANIZATION_SIZES
        },
        linkedin: { type: String },
        type: {
            type: String,
            enum: ORGANIZATION_TYPES
        },
        description: { type: String },
        logo: { type: String },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        ownerId: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);
