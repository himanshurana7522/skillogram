import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
  media_url: { type: String, default: null },
  readAt: { type: Date, default: null },
}, { timestamps: true });

// Optimize querying messages for a specific chat in chronological order
MessageSchema.index({ chat_id: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
