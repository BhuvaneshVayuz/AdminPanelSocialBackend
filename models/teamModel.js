import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        sbuId: { type: mongoose.Schema.Types.ObjectId, ref: "SBU", required: true },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export const Team = mongoose.model("Team", teamSchema);
