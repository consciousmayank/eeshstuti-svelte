import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async () => {
  try {
    const deities = await prisma.deity.findMany({
      include: {
        images: {
          take: 1 // Get at least one image for preview
        }
      }
    });
    
    return json(deities);
  } catch (error) {
    console.error('Error fetching deities:', error);
    return json({ error: 'Failed to fetch deities' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    const { name, description, imageName } = body;
    
    if (!name) {
      return json({ error: 'Name is required' }, { status: 400 });
    }
    
    const deity = await prisma.deity.create({
      data: {
        name,
        description,
        imageName
      }
    });
    
    return json(deity, { status: 201 });
  } catch (error) {
    console.error('Error creating deity:', error);
    return json({ error: 'Failed to create deity' }, { status: 500 });
  }
}; 