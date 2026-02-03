import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBranch extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    address: string;
    lat: number;
    lng: number;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BranchSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        phoneNumber: { type: String },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite of the model if it already exists (Next.js hot reload issues)
const Branch: Model<IBranch> =
    mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
