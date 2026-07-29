import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Optimize querying for a user's chats
ChatSchema.index({ participants: 1, lastMessageAt: -1 });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
