import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  activeCount: number;
  color: string;
  icon: string;
}

const CommunitySchema = new Schema<ICommunity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  activeCount: { type: Number, default: 0 },
  color: { type: String, required: true },
  icon: { type: String, required: true }
}, {
  timestamps: true
});

// Avoid OverwriteModelError
export const Community = mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);
