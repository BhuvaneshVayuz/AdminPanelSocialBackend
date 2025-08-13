// models/userRoleMappingModel.js
import mongoose from "mongoose";
import { Role } from "./roleModel.js";

const userRoleMappingSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // socialId from external API
        roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
        entityType: { type: String, enum: ["organization", "sbu", "team"], default: null },
        entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
        assignedBy: { type: String }, // who assigned the role
    },
    { timestamps: true }
);

userRoleMappingSchema.pre("validate", async function (next) {
    if (this.roleId) {
        const role = await Role.findById(this.roleId);
        if (role && role.name !== "superadmin") {
            if (!this.entityType || !this.entityId) {
                return next(new Error("entityType and entityId are required for non-superadmin roles"));
            }
        }
    }
    next();
});

userRoleMappingSchema.index(
    { userId: 1, roleId: 1, entityType: 1, entityId: 1 },
    { unique: true }
);

export const UserRoleMapping = mongoose.model("UserRoleMapping", userRoleMappingSchema);
