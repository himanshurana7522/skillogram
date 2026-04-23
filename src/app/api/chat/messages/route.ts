import { MOCK_DB } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('contactId');

  if (!contactId) {
    return Response.json({ error: 'Missing contactId' }, { status: 400 });
  }

  // Find the contact to get their name for dummy messages
  const contact = MOCK_DB.userPool.find(u => u.id === contactId);
  const contactName = contact ? contact.name : 'User';

  // Dynamic dummy message history
  const history = [
    { id: '1', text: `Hi! I saw we matched. I'm really interested in your ${MOCK_DB.profile.teachingSkills[0]} skills!`, sender: 'them', time: '10:30 AM' },
    { id: '2', text: `Hey ${contactName}! Absolutely, I'd love to help. I'm looking to learn more about ${contact?.teachingSkills[0] || 'your skills'}.`, sender: 'me', time: '10:35 AM' },
    { id: '3', text: 'Awesome. Want to jump on a quick session in one of the rooms later?', sender: 'them', time: '10:38 AM' },
  ];

  return Response.json({ history });
}
