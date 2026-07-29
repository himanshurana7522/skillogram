import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed password
  age: { type: Number, default: 20 },
  rating: { type: Number, default: 5.0 },
  bio: { type: String, default: 'New to the Nebula.' },
  teachingSkills: { type: [String], default: [] },
  learningSkills: { type: [String], default: [] },
  color: { type: String, default: '#B535F6' },
  initials: { type: String, default: 'U' },
  accountType: { type: String, enum: ['personal', 'creator', 'business'], default: 'personal' },
  isPrivate: { type: Boolean, default: false },
  avatarUrl: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
