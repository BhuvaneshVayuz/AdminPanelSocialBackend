// models/teamModel.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
        sbuId: { type: mongoose.Schema.Types.ObjectId, ref: "SBU", required: true },
        teamLeadId: { type: String }, // socialId of team lead
        members: [{ type: String }], // array of socialIds
    },
    { timestamps: true }
);

teamSchema.index({ organizationId: 1, sbuId: 1 });

export const Team = mongoose.model("Team", teamSchema);
