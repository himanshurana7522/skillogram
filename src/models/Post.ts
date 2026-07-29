import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media_urls: { type: [String], default: [] },
  type: { type: String, enum: ['image', 'video', 'text'], default: 'image' },
  caption: { type: String, default: '' },
  hashtags: { type: [String], default: [] },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
}, { timestamps: true });

// Create indexes to optimize feed sorting and fetching user profiles
PostSchema.index({ createdAt: -1 });
PostSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
