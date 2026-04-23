import { MOCK_DB } from '@/lib/db';

export async function GET() {
  const stories = MOCK_DB.stories;
  // Group stories by userId for the horizontal bar
  const grouped = stories.reduce((acc: any, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = {
        userId: story.userId,
        username: story.username,
        stories: [],
      };
    }
    acc[story.userId].stories.push(story);
    return acc;
  }, {});

  return Response.json({ storyGroups: Object.values(grouped) });
}
