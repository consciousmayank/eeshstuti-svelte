import { prisma } from '$lib/db';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    try {
        const prayerTypes = await prisma.prayerType.findMany();
        return json(prayerTypes);
    } catch (error) {
        console.error('Error fetching prayer types:', error);
        return json({ error: 'Failed to fetch prayer types' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    const { name } = await request.json();
    
    if (!name) {
        throw new Error('Name is required');
    }
    
    try {
        const prayerType = await prisma.prayerType.create({ 
            data: { 
                name,
            } 
        });
        return json(prayerType, { status: 201 });
    } catch (error) {
        console.error('Error creating prayer type:', error);
        return json({ error: 'Failed to create prayer type' }, { status: 500 });
    }
};
