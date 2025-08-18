// models/userModel.js
import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
    sbuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SBU",
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
    },
}, { _id: false });

const userSchema = new mongoose.Schema({
    socialId: { type: String, required: true, unique: true }, // external system ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    roles: [userRoleSchema],  // array of role assignments
    syncedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
