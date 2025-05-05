<script lang="ts">
	import { B2ImageViewer } from 'b2-image-tools/components';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    
    export let data;
    
    // Define interfaces for our data types
    interface DeityCount {
        mantra: number;
        stotram: number;
        ashtakam: number;
        prayer: number;
        total: number;
    }

    interface Deity {
        id: string;
        name: string;
        description: string;
        imageName?: string;
        sanskrit?: string;
        counts?: DeityCount;
        prayers?: any[];
        longDescription?: string;
        relatedDeities?: string[];
    }
    
    interface Prayer {
        id: string;
        name: string;
        type: string;
        deityId: string;
        content?: string;
        translation?: string;
        deity?: Deity;
    }
    
    // Variables for the all deities grid
    let deities: Deity[] = [];
    let loading = true;
    let error: string | null = null;
    
    // Edit modal state variables
    let showEditModal = false;
    let editingDeity: Deity | null = null;
    let editName = '';
    let editDescription = '';
    let savingChanges = false;
    let saveError: string | null = null;
    
    // Helper function to truncate text
    function truncateText(text: string, length = 100): string {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
    
    // Fetch all deities from the database
    async function fetchDeities() {
        try {
            loading = true;
            const response = await fetch('/api/deities');
            if (!response.ok) throw new Error('Failed to load deities');
            
            // Get deities data
            const fetchedDeities: Omit<Deity, 'counts'>[] = await response.json();
            
            // Fetch prayers for each deity to count mantras, stotrams, and ashtakams
            const prayersResponse = await fetch('/api/prayers');
            if (!prayersResponse.ok) throw new Error('Failed to load prayers');
            
            const prayers: Prayer[] = await prayersResponse.json();
            
            // Calculate counts for each deity
            deities = fetchedDeities.map((deity) => {
                const deityPrayers = prayers.filter((prayer: Prayer) => prayer.deityId === deity.id);
                
                const counts: DeityCount = {
                    mantra: deityPrayers.filter((p: Prayer) => p.type === 'mantra').length,
                    stotram: deityPrayers.filter((p: Prayer) => p.type === 'stotram').length,
                    ashtakam: deityPrayers.filter((p: Prayer) => p.type === 'ashtakam').length,
                    prayer: deityPrayers.filter((p: Prayer) => p.type === 'prayer').length,
                    total: deityPrayers.length
                };
                
                return {
                    ...deity,
                    counts,
                    description: deity.description || ''
                };
            });
            
            loading = false;
        } catch (e: unknown) {
            console.error('Error fetching deities:', e);
            error = e instanceof Error ? e.message : 'Unknown error';
            loading = false;
        }
    }
    
    // Open edit modal
    function openEditModal(deity: Deity) {
        editingDeity = deity;
        editName = deity.name;
        editDescription = deity.description;
        showEditModal = true;
        saveError = null;
    }
    
    // Close edit modal
    function closeEditModal() {
        showEditModal = false;
        editingDeity = null;
        saveError = null;
    }
    
    // Save edited deity
    async function saveDeity() {
        if (!editingDeity) return;
        
        // Validate form fields
        if (!editName.trim()) {
            saveError = 'Name cannot be empty';
            return;
        }
        
        try {
            savingChanges = true;
            saveError = null;
            
            const response = await fetch(`/api/deities/${editingDeity.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update deity');
            }
            
            // Update local deity data
            const updatedDeity = await response.json();
            deities = deities.map(d => d.id === editingDeity?.id ? {...d, name: editName, description: editDescription} : d);
            
            // Close modal
            closeEditModal();
            
        } catch (e: unknown) {
            console.error('Error updating deity:', e);
            saveError = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            savingChanges = false;
        }
    }
    
    onMount(() => {
        fetchDeities();
    });
</script>
  
<svelte:head>
    <title>Hindu Deities - Eesh-Stuti | Hindu Prayers</title>
</svelte:head>
  
<div class="bg-gradient-to-b from-amber-50 to-orange-50 min-h-screen">
    <main>
        <!-- Breadcrumb -->
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center text-sm text-gray-600">
                <a href="/" class="hover:text-red-800">Home</a>
                <span class="mx-2">/</span>
                <span class="text-red-800 font-medium">Deities</span>
            </div>
        </div>

        <!-- All Deities Grid Section -->
        <section class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold text-red-800 text-center mb-10">Hindu Deities</h1>
            
            {#if loading}
                <div class="flex items-center justify-center py-12">
                    <div class="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    <span class="ml-2 text-gray-600">Loading deities...</span>
                </div>
            {:else if error}
                <div class="mx-auto max-w-md rounded-lg bg-red-100 p-4 text-center text-red-700">
                    <p>Error loading deities: {error}</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {#each deities as deity, i}
                        <div 
                            class="group overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
                            in:fly={{ y: 50, duration: 800, delay: 150 + i * 100 }}
                        >
                            <a 
                                href={`/deity/${deity.id}`}
                                class="block"
                            >
                                <div class="relative h-80 overflow-hidden">
                                    <B2ImageViewer
                                        fileName={deity.imageName}
                                        autoLoad={true}
                                        showFileName={false}
                                        width="100%"
                                        height="auto"
                                        useApiEndpoint={true}
                                        on:load={(e) => console.log(`Loaded: ${e.detail.fileName}`)}
                                        on:error={(e) => console.error(e.detail.error)}
                                    />
                                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h3 class="text-2xl font-bold text-white">{deity.name}</h3>
                                        {#if deity.sanskrit}
                                            <span class="text-amber-200">{deity.sanskrit}</span>
                                        {/if}
                                    </div>
                                </div>
                            </a>
                            
                            <div class="p-5">
                                <div class="mb-4 flex flex-wrap gap-2">
                                    {#if deity.counts && deity.counts.mantra > 0}
                                        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-red-800">
                                            {deity.counts.mantra} Mantras
                                        </span>
                                    {/if}
                                    
                                    {#if deity.counts && deity.counts.stotram > 0}
                                        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-red-800">
                                            {deity.counts.stotram} Stotrams
                                        </span>
                                    {/if}
                                    
                                    {#if deity.counts && deity.counts.ashtakam > 0}
                                        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-red-800">
                                            {deity.counts.ashtakam} Ashtakams
                                        </span>
                                    {/if}
                                    
                                    {#if deity.counts && deity.counts.prayer > 0}
                                        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-red-800">
                                            {deity.counts.prayer} Prayers
                                        </span>
                                    {/if}
                                </div>
                                
                                <p class="mb-4 text-gray-700 h-20 ">{truncateText(deity.description, 80)}</p>
                                
                                <div class="flex items-center justify-between">
                                    <a 
                                        href={`/deity/${deity.id}`}
                                        class="inline-block font-medium text-red-800 group-hover:text-red-600 group-hover:underline"
                                    >
                                        View Details →
                                    </a>
                                    
                                    <button 
                                        on:click|stopPropagation={(e) => {
                                            e.preventDefault();
                                            openEditModal(deity);
                                        }}
                                        class="rounded bg-amber-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </section>
    </main>
</div>

<!-- Edit Deity Modal -->
{#if showEditModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" transition:fade={{ duration: 200 }}>
        <div 
            class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            in:fly={{ y: 20, duration: 300 }}
        >
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-800">Edit Deity</h2>
                <button 
                    on:click={closeEditModal}
                    class="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {#if saveError}
                <div class="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                    {saveError}
                </div>
            {/if}
            
            <form on:submit|preventDefault={saveDeity}>
                <div class="mb-4">
                    <label for="deityName" class="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        id="deityName" 
                        bind:value={editName} 
                        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        required
                    />
                </div>
                
                <div class="mb-6">
                    <label for="deityDescription" class="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        id="deityDescription" 
                        bind:value={editDescription} 
                        rows="4"
                        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    ></textarea>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button 
                        type="button" 
                        on:click={closeEditModal}
                        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        disabled={savingChanges}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        disabled={savingChanges}
                    >
                        {#if savingChanges}
                            <span class="flex items-center">
                                <svg class="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        {:else}
                            Save Changes
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    :global(body) {
        font-family: 'Poppins', sans-serif;
        color: #4b5563;
    }
</style>