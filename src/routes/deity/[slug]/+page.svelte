<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    
    export let data;
    
    // This would normally come from your data.js or server via the page load function
    // For now we'll use a static example
    const deity = {
      id: 'ganesha',
      name: 'Lord Ganesha',
      sanskrit: 'गणेश',
      description: 'Lord Ganesha, the elephant-headed God, is one of the most worshipped deities in the Hindu pantheon. Known as the remover of obstacles and the god of beginnings, he is invoked before the start of any auspicious work.',
      longDescription: 'Ganesha is widely revered as the Remover of Obstacles and more generally as Lord of Beginnings and Lord of Obstacles, patron of arts and sciences, and the deva of intellect and wisdom. As the god of beginnings, he is honoured at the start of ceremonies and rituals. Ganesha is also invoked as patron of letters and learning during writing sessions.',
      image: 'https://images.unsplash.com/photo-1567591414240-e9c0cc916440?q=80&w=1000&auto=format&fit=crop',
      prayers: [
        {
          id: 'ganesh-vandana',
          title: 'Ganesh Vandana',
          sanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
          translation: 'O Lord with the curved trunk and massive body, who has the brilliance of a million suns, please bless me so that there are no obstacles in my endeavors.',
          audio: '/audio/ganesh-vandana.mp3'
        },
        {
          id: 'ganesh-stotram',
          title: 'Ganesh Stotram',
          sanskrit: 'सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः। लम्बोदरश्च विकटो विघ्नराजो गणाधिपः॥',
          translation: 'The one with a pleasant face, who has one tusk, who has a tawny complexion, who has ears like an elephant, who has a big belly, who has a massive body, the king of obstacles, the Lord of all Ganas.',
          audio: '/audio/ganesh-stotram.mp3'
        },
        {
          id: 'ganesh-ashtakam',
          title: 'Ganesh Ashtakam',
          sanskrit: 'नमस्ते गणपतये त्वमेव प्रत्यक्षं तत्त्वमसि। त्वमेव केवलं कर्तासि। त्वमेव केवलं धर्तासि। त्वमेव केवलं हर्तासि॥',
          translation: 'Salutations to Lord Ganapati. You alone are the manifest principle. You alone are the creator. You alone are the sustainer. You alone are the destroyer.',
          audio: '/audio/ganesh-ashtakam.mp3'
        }
      ],
      relatedDeities: ['shiva', 'parvati', 'kartikeya']
    };
    
    let activeTab = 'prayers';
    let visible = false;
    
    onMount(() => {
      visible = true;
    });
</script>
  
<svelte:head>
  <title>{deity.name} - Eesh-Stuti | Hindu Prayers</title>
</svelte:head>
  
<div class="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen">
  <main>
    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center text-sm text-gray-600">
        <a href="/" class="hover:text-red-800">Home</a>
        <span class="mx-2">/</span>
        <a href="/deity" class="hover:text-red-800">Deities</a>
        <span class="mx-2">/</span>
        <span class="text-red-800 font-medium">{deity.name}</span>
      </div>
    </div>
    
    <!-- Deity Hero -->
    {#if visible}
      <section class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/3" in:fade={{ duration: 800 }}>
              <img 
                src={deity.image || "/placeholder.svg"} 
                alt={deity.name} 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="md:w-2/3 p-8" in:fly={{ x: 50, duration: 800 }}>
              <div class="flex items-center gap-3 mb-4">
                <h1 class="text-4xl font-bold text-red-800">{deity.name}</h1>
                <span class="text-3xl text-red-700">{deity.sanskrit}</span>
              </div>
              <p class="text-xl text-gray-700 mb-6">{deity.description}</p>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p class="text-gray-800">{deity.longDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    {/if}
    
    <!-- Tabs -->
    <section class="container mx-auto px-4 py-8">
      <div class="flex border-b border-gray-300 mb-8">
        <button 
          class={`py-3 px-6 font-medium ${activeTab === 'prayers' ? 'text-red-800 border-b-2 border-red-800' : 'text-gray-600 hover:text-red-800'}`}
          on:click={() => activeTab = 'prayers'}
        >
          Prayers & Mantras
        </button>
        <button 
          class={`py-3 px-6 font-medium ${activeTab === 'stories' ? 'text-red-800 border-b-2 border-red-800' : 'text-gray-600 hover:text-red-800'}`}
          on:click={() => activeTab = 'stories'}
        >
          Stories & Legends
        </button>
        <button 
          class={`py-3 px-6 font-medium ${activeTab === 'gallery' ? 'text-red-800 border-b-2 border-red-800' : 'text-gray-600 hover:text-red-800'}`}
          on:click={() => activeTab = 'gallery'}
        >
          Gallery
        </button>
      </div>
      
      <!-- Prayers Tab -->
      {#if activeTab === 'prayers'}
        <div class="space-y-8">
          {#each deity.prayers as prayer, i}
            <div 
              class="bg-white rounded-xl shadow-md overflow-hidden"
              in:fly={{ y: 20, duration: 500, delay: i * 150 }}
            >
              <div class="p-6">
                <h3 class="text-2xl font-bold text-red-800 mb-4">{prayer.title}</h3>
                <div class="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                  <p class="text-lg font-medium text-red-700">{prayer.sanskrit}</p>
                </div>
                <div class="mb-6">
                  <h4 class="text-sm uppercase text-gray-500 mb-2">Translation</h4>
                  <p class="text-gray-800">{prayer.translation}</p>
                </div>
                <div class="flex items-center justify-between">
                  <button class="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                    Listen to Prayer
                  </button>
                  <button class="flex items-center gap-2 text-gray-600 hover:text-red-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      <!-- Stories Tab -->
      {#if activeTab === 'stories'}
        <div class="bg-white rounded-xl shadow-md p-6" in:fade>
          <h3 class="text-2xl font-bold text-red-800 mb-4">The Birth of Ganesha</h3>
          <p class="text-gray-800 mb-4">
            Once, Goddess Parvati was preparing for a bath and needed someone to guard the entrance. She created a boy from the turmeric paste she was using and breathed life into him, instructing him to guard the door and not let anyone in.
          </p>
          <p class="text-gray-800 mb-4">
            When Lord Shiva returned, he was stopped by the boy. Shiva, unaware that this was his son created by Parvati, became angry and in a fit of rage, severed the boy's head with his trident.
          </p>
          <p class="text-gray-800 mb-4">
            When Parvati learned what had happened, she was devastated and furious. To appease her, Shiva promised to revive the boy. He sent his followers to bring back the head of the first creature they encountered facing north. They returned with an elephant's head, which Shiva attached to the boy's body, bringing him back to life.
          </p>
          <p class="text-gray-800">
            Shiva then declared that the boy would be known as Ganesha, the lord of his followers, and that he would be worshipped before all other gods.
          </p>
        </div>
      {/if}
      
      <!-- Gallery Tab -->
      {#if activeTab === 'gallery'}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" in:fade>
          <div class="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1000&auto=format&fit=crop" 
              alt="Ganesha Statue" 
              class="w-full h-64 object-cover"
            />
            <div class="p-4">
              <p class="text-gray-700">Ancient Ganesha statue from South India</p>
            </div>
          </div>
          <div class="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1623604427799-d1a8ad8e5dda?q=80&w=1000&auto=format&fit=crop" 
              alt="Ganesha Painting" 
              class="w-full h-64 object-cover"
            />
            <div class="p-4">
              <p class="text-gray-700">Traditional Ganesha painting</p>
            </div>
          </div>
          <div class="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1633889604211-f70a47dac0b0?q=80&w=1000&auto=format&fit=crop" 
              alt="Ganesha Festival" 
              class="w-full h-64 object-cover"
            />
            <div class="p-4">
              <p class="text-gray-700">Ganesh Chaturthi celebration</p>
            </div>
          </div>
        </div>
      {/if}
    </section>
    
    <!-- Related Deities -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-red-800 mb-6">Related Deities</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/deity/shiva" class="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="https://images.unsplash.com/photo-1627925234574-f90f39d8f256?q=80&w=200&auto=format&fit=crop" 
            alt="Lord Shiva" 
            class="w-12 h-12 rounded-full object-cover"
          />
          <span class="font-medium text-gray-800">Lord Shiva</span>
        </a>
        <a href="/deity/parvati" class="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?q=80&w=200&auto=format&fit=crop" 
            alt="Goddess Parvati" 
            class="w-12 h-12 rounded-full object-cover"
          />
          <span class="font-medium text-gray-800">Goddess Parvati</span>
        </a>
        <a href="/deity/kartikeya" class="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?q=80&w=200&auto=format&fit=crop" 
            alt="Lord Kartikeya" 
            class="w-12 h-12 rounded-full object-cover"
          />
          <span class="font-medium text-gray-800">Lord Kartikeya</span>
        </a>
      </div>
    </section>
  </main>
</div>
  
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
  :global(body) {
    font-family: 'Poppins', sans-serif;
    color: #4b5563;
  }
</style>