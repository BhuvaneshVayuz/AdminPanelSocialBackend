// models/sbuModel.js
import mongoose from "mongoose";

const sbuSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        sbuLeadId: { type: String }, // socialId of SBU lead
        description: { type: String },
        websiteUrl: { type: String },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    },
    { timestamps: true }
);

sbuSchema.index({ organizationId: 1 });

export const SBU = mongoose.model("SBU", sbuSchema);
