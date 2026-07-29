import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { rankMatchSuggestions } from '@/lib/algorithm';

export async function GET() {
  await dbConnect();
  
  const pool = await User.find({}).limit(20);
  
  // Create a mock current user since we don't have the session injected in this mock GET
  const currentUser = {
    id: "me",
    name: "Me",
    username: "me",
    age: 20,
    rating: 5,
    bio: "",
    teachingSkills: ["React"],
    learningSkills: ["Node"],
    color: "#000",
    initials: "M",
    accountType: "personal" as const,
    isPrivate: false
  };

  // Convert mongoose documents to simple objects so the algorithm works
  const plainPool = pool.map(p => ({
    id: p._id.toString(),
    name: p.name,
    username: p.username,
    age: p.age,
    rating: p.rating,
    bio: p.bio,
    teachingSkills: p.teachingSkills,
    learningSkills: p.learningSkills,
    color: p.color,
    initials: p.initials,
    accountType: p.accountType,
    isPrivate: p.isPrivate
  }));

  const results = rankMatchSuggestions(currentUser, plainPool);
  
  const suggestions = results.map(r => ({
    ...r.user,
    aiScore: r.score,
    aiReason: r.reason
  }));

  return Response.json({ suggestions });
}
