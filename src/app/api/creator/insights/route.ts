import { MOCK_DB } from '@/lib/db';

export async function GET() {
  // Simulate professional analytics
  const insights = {
    accountsReached: 42300,
    accountsReachedGrowth: '+12.5%',
    accountsEngaged: 1205,
    accountsEngagedGrowth: '+8.2%',
    totalFollowers: 12400,
    followerGrowth: '+254',
    topLocations: ['Barcelona', 'San Francisco', 'New York', 'London'],
    ageRange: { '18-24': '45%', '25-34': '38%', '35-44': '12%', '45+': '5%' },
    genderDist: { Women: '62%', Men: '35%', Other: '3%' },
    topContent: MOCK_DB.reels.slice(0, 3),
  };

  return Response.json({ insights });
}
