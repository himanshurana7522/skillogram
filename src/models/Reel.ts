import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  color: { type: String, default: '#B535F6' },
  views: { type: String, default: '0' },
  skill: { type: String, default: 'General' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  mediaUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.Reel || mongoose.model('Reel', ReelSchema);
