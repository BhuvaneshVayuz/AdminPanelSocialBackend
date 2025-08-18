// models/sbuModel.js
import mongoose from "mongoose";

const sbuSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        leadSocialIds: [{ type: String }], // ✅ multiple SBU leads (social IDs)
        description: { type: String },
        websiteUrl: { type: String },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
    },
    { timestamps: true }
);

// Index for fast lookups
sbuSchema.index({ organizationId: 1 });

export const SBU = mongoose.model("SBU", sbuSchema);
