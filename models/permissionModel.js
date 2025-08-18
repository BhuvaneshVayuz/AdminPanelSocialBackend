// models/permissionModel.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            unique: true,
        },
        description: { type: String },
    },
    { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);
