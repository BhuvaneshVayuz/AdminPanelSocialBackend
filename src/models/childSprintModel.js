import mongoose from "mongoose";

const childSprintSchema = new mongoose.Schema(
    {
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sprint",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export const ChildSprint = mongoose.model("ChildSprint", childSprintSchema);
