   import { json } from '@sveltejs/kit';
   import type { RequestHandler } from './$types';
   import { prisma } from '$lib/db';
   
   export const PATCH: RequestHandler = async ({ params, request }) => {
     const { id } = params;
     const { name, content, type, translation, deityId, audioUrl } = await request.json();
   
     try {
       const updatedPrayer = await prisma.prayer.update({
         where: { id },
         data: { name, content, type, translation, deityId, audioUrl }
       });
   
       return json(updatedPrayer);
     } catch (error) {
       console.error(`Error updating prayer ${id}:`, error);
       return json({ error: 'Failed to update prayer' }, { status: 500 });
     }
   };