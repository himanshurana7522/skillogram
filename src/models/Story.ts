import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media_url: { type: String, required: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL index to automatically delete stories after 24 hours (based on expiresAt field)
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Story || mongoose.model('Story', StorySchema);
