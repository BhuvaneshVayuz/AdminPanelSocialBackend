// models/roleModel.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ["superadmin", "org_admin", "sbu_lead", "team_lead", "member"],
        },
        description: { type: String },
    },
    { timestamps: true }
);



export const Role = mongoose.model("Role", roleSchema);

