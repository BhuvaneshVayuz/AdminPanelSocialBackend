// models/permissionModel.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            unique: true,
            // Examples: "org:create", "sbu:create", "team:add_member"
        },
        description: { type: String },
    },
    { timestamps: true }
);


export const Permission = mongoose.model("Permission", permissionSchema);
