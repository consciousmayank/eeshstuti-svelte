import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  // Fetch featured deities
  const deitiesResponse = await fetch('/api/deities');
  const deities = await deitiesResponse.json();
  
  // Get only the first 3 deities as featured
  const featured = deities.slice(0, 3).map((deity: any) => ({
    id: deity.id,
    name: deity.name,
    description: deity.description || '',
    image: deity.images?.[0]?.url || 'https://images.unsplash.com/photo-1567591414240-e9c0cc916440?q=80&w=1000&auto=format&fit=crop'
  }));
  
  // Create categories (this would be better if categories were in the database)
  const categories = [
    { name: 'Vishnu', count: deities.filter((d: any) => d.name.includes('Vishnu')).length || 12 },
    { name: 'Shiva', count: deities.filter((d: any) => d.name.includes('Shiva')).length || 15 },
    { name: 'Shakti', count: deities.filter((d: any) => d.name.includes('Lakshmi') || d.name.includes('Durga') || d.name.includes('Parvati')).length || 10 },
    { name: 'Ganesha', count: deities.filter((d: any) => d.name.includes('Ganesha')).length || 8 },
    { name: 'Hanuman', count: deities.filter((d: any) => d.name.includes('Hanuman')).length || 6 },
    { name: 'Surya', count: deities.filter((d: any) => d.name.includes('Surya')).length || 4 }
  ];
  
  return {
    featured,
    categories
  };
}; 