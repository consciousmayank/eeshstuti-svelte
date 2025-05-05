import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const deityId = url.searchParams.get('deityId');
    const type = url.searchParams.get('type');
    
    // Build the where clause based on query parameters
    const where: any = {};
    if (deityId) where.deityId = deityId;
    if (type) where.type = type;
    
    const prayers = await prisma.prayer.findMany({
      where,
      include: {
        deity: true
      }
    });
    
    return json(prayers);
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return json({ error: 'Failed to fetch prayers' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    const { name, content, type, translation, deityId, audioUrl } = body;
    
    if (!name || !content || !type || !deityId) {
      return json({ error: 'Name, content, type, and deityId are required' }, { status: 400 });
    }
    
    // First check if the deity exists
    const deity = await prisma.deity.findUnique({
      where: { id: deityId }
    });
    
    if (!deity) {
      return json({ error: 'Deity not found' }, { status: 404 });
    }
    
    const prayer = await prisma.prayer.create({
      data: {
        name,
        content,
        type,
        translation,
        audioUrl,
        deityId
      }
    });
    
    return json(prayer, { status: 201 });
  } catch (error) {
    console.error('Error creating prayer:', error);
    return json({ error: 'Failed to create prayer' }, { status: 500 });
  }
}; 

