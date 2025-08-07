import mongoose from 'mongoose';

const sbuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const SBU = mongoose.model('SBU', sbuSchema);
