import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async () => {
    try{
        const images = await prisma.image.findMany();
        return json(images);

    }catch(error){
        console.log(error)
        return json({ error: 'Failed to fetch images' }, { status: 500 });
    }
};



// export const GET: RequestHandler = async () => {
//     try {
//       const deiasdasdasdasties = await prisma.deity.findMany({
//         include: {
//           images: {
//             take: 1 // Get at least one image for preview
//           }
//         }
//       });
      
//       return json(deities);
//     } catch (error) {
//       console.error('Error fetching deities:', error);
//       return json({ error: 'Failed to fetch deities' }, { status: 500 });
//     }
//   };