import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch(`/api/deities/${params.slug}`);
    
    if (!response.ok) {
      throw error(response.status, `Could not load deity: ${params.slug}`);
    }
    
    const deity = await response.json();
    
    return {
      deity
    };
  } catch (e) {
    console.error('Error loading deity:', e);
    throw error(404, `Could not find deity: ${params.slug}`);
  }
};