<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    
    // This would normally come from your data.js or server
    let prayers = [
      {
        id: 'ganesh-vandana',
        title: 'Ganesh Vandana',
        deity: 'Ganesha',
        category: 'Stotram',
        language: 'Sanskrit',
        length: 'Short',
        featured: true
      },
      {
        id: 'vishnu-sahasranamam',
        title: 'Vishnu Sahasranamam',
        deity: 'Vishnu',
        category: 'Sahasranamam',
        language: 'Sanskrit',
        length: 'Long',
        featured: true
      },
      {
        id: 'shiva-tandava-stotram',
        title: 'Shiva Tandava Stotram',
        deity: 'Shiva',
        category: 'Stotram',
        language: 'Sanskrit',
        length: 'Medium',
        featured: true
      },
      {
        id: 'hanuman-chalisa',
        title: 'Hanuman Chalisa',
        deity: 'Hanuman',
        category: 'Chalisa',
        language: 'Awadhi',
        length: 'Medium',
        featured: true
      },
      {
        id: 'durga-saptashati',
        title: 'Durga Saptashati',
        deity: 'Durga',
        category: 'Saptashati',
        language: 'Sanskrit',
        length: 'Long',
        featured: false
      },
      {
        id: 'lakshmi-ashtakam',
        title: 'Lakshmi Ashtakam',
        deity: 'Lakshmi',
        category: 'Ashtakam',
        language: 'Sanskrit',
        length: 'Short',
        featured: false
      },
      {
        id: 'saraswati-vandana',
        title: 'Saraswati Vandana',
        deity: 'Saraswati',
        category: 'Vandana',
        language: 'Sanskrit',
        length: 'Short',
        featured: false
      },
      {
        id: 'rama-raksha-stotram',
        title: 'Rama Raksha Stotram',
        deity: 'Rama',
        category: 'Stotram',
        language: 'Sanskrit',
        length: 'Medium',
        featured: false
      },
      {
        id: 'krishna-ashtakam',
        title: 'Krishna Ashtakam',
        deity: 'Krishna',
        category: 'Ashtakam',
        language: 'Sanskrit',
        length: 'Short',
        featured: false
      },
      {
        id: 'gayatri-mantra',
        title: 'Gayatri Mantra',
        deity: 'Surya',
        category: 'Mantra',
        language: 'Sanskrit',
        length: 'Short',
        featured: true
      },
      {
        id: 'kali-kavacham',
        title: 'Kali Kavacham',
        deity: 'Kali',
        category: 'Kavacham',
        language: 'Sanskrit',
        length: 'Medium',
        featured: false
      },
      {
        id: 'subrahmanya-ashtakam',
        title: 'Subrahmanya Ashtakam',
        deity: 'Kartikeya',
        category: 'Ashtakam',
        language: 'Sanskrit',
        length: 'Short',
        featured: false
      }
    ];
    
    let filters = {
      deity: '',
      category: '',
      length: '',
      language: ''
    };
    
    let searchQuery = '';
    let filteredPrayers = prayers;
    
    $: {
      filteredPrayers = prayers.filter(prayer => {
        // Search query filter
        if (searchQuery && !prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !prayer.deity.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Deity filter
        if (filters.deity && prayer.deity !== filters.deity) {
          return false;
        }
        
        // Category filter
        if (filters.category && prayer.category !== filters.category) {
          return false;
        }
        
        // Length filter
        if (filters.length && prayer.length !== filters.length) {
          return false;
        }
        
        // Language filter
        if (filters.language && prayer.language !== filters.language) {
          return false;
        }
        
        return true;
      });
    }
    
    let deities = [...new Set(prayers.map(prayer => prayer.deity))];
    let categories = [...new Set(prayers.map(prayer => prayer.category))];
    let lengths = [...new Set(prayers.map(prayer => prayer.length))];
    let languages = [...new Set(prayers.map(prayer => prayer.language))];
    
    let visible = false;
    
    onMount(() => {
      visible = true;
    });
    
    function clearFilters() {
      filters = {
        deity: '',
        category: '',
        length: '',
        language: ''
      };
      searchQuery = '';
    }
  </script>
  
  <svelte:head>
    <title>Prayers & Mantras - Eesh-Stuti | Hindu Prayers</title>
  </svelte:head>
  
  <div class="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen">
    
  
    <main class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-red-800 mb-4">Prayers & Mantras</h1>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto">
          Discover sacred prayers, mantras, stotrams, and more for all Hindu deities
        </p>
      </div>
      
      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="mb-6">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input 
            type="text" 
            id="search" 
            bind:value={searchQuery}
            placeholder="Search by prayer name or deity..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="deity" class="block text-sm font-medium text-gray-700 mb-1">Deity</label>
            <select 
              id="deity" 
              bind:value={filters.deity}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Deities</option>
              {#each deities as deity}
                <option value={deity}>{deity}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              id="category" 
              bind:value={filters.category}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label for="length" class="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <select 
              id="length" 
              bind:value={filters.length}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Any Length</option>
              {#each lengths as length}
                <option value={length}>{length}</option>
              {/each}
            </select>
          </div>
          
          <div>
            <label for="language" class="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select 
              id="language" 
              bind:value={filters.language}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Languages</option>
              {#each languages as language}
                <option value={language}>{language}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            on:click={clearFilters}
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-red-800">
            {filteredPrayers.length} {filteredPrayers.length === 1 ? 'Prayer' : 'Prayers'} Found
          </h2>
          <div class="text-gray-600">
            Showing {filteredPrayers.length} of {prayers.length} prayers
          </div>
        </div>
        
        {#if filteredPrayers.length === 0}
          <div class="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-700 mb-2">No prayers found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button 
              on:click={clearFilters}
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredPrayers as prayer, i}
              {#if visible}
                <a 
                  href={`/prayer/${prayer.id}`}
                  class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  in:fly={{ y: 20, duration: 500, delay: i * 100 }}
                >
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <h3 class="text-xl font-bold text-red-800">{prayer.title}</h3>
                      {#if prayer.featured}
                        <span class="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Featured</span>
                      {/if}
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {prayer.deity}
                      </span>
                      <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {prayer.category}
                      </span>
                      <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {prayer.length}
                      </span>
                      <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {prayer.language}
                      </span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">View prayer</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-800" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </a>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    </main>
  
  </div>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    :global(body) {
      font-family: 'Poppins', sans-serif;
      color: #4b5563;
    }
  </style>