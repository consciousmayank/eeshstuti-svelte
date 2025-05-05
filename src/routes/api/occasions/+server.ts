import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async () => {
  try {
    const occasions = await prisma.occasion.findMany({
      include: {
        deities: {
          include: {
            deity: {
              include: {
                images: {
                  take: 1
                }
              }
            }
          }
        },
        prayers: {
          include: {
            prayer: true
          }
        }
      }
    });
    
    return json(occasions);
  } catch (error) {
    console.error('Error fetching occasions:', error);
    return json({ error: 'Failed to fetch occasions' }, { status: 500 });
  } 
}; 