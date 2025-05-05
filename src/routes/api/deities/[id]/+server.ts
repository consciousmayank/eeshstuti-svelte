import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  
  try {
    const deity = await prisma.deity.findUnique({
      where: { id },
      include: {
        prayers: true,
        stories: true,
        images: true,
        occasions: {
          include: {
            occasion: true
          }
        }
      }
    });
    
    if (!deity) {
      return json({ error: 'Deity not found' }, { status: 404 });
    }
    
    return json(deity);
  } catch (error) {
    console.error(`Error fetching deity ${id}:`, error);
    return json({ error: 'Failed to fetch deity' }, { status: 500 });
  }
}; 

export const PATCH: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const { name, description, imageName } = await request.json();

  try {
    const updatedDeity = await prisma.deity.update({
      where: { id },
      data: { name, description, imageName }
    });

    return json(updatedDeity);
  } catch (error) {
    console.error(`Error updating deity ${id}:`, error);
    return json({ error: 'Failed to update deity' }, { status: 500 });
  }
}; 