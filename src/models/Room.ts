import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  type: { type: String, enum: ['video', 'audio'], default: 'video' },
  host: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participantsCount: { type: Number, default: 1 },
  color: { type: String, default: '#B535F6' },
}, { timestamps: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
