<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import UnSplashAttribution from '../components/UnSplash-attribution.svelte';
	import { B2ImageViewer } from 'b2-image-tools/components';
	let imageFileName = 'file_1745716233634.jpeg';

	// Get data from page load function
	export let data;
	const { featured, categories } = data;

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
		image?: string;
		sanskrit?: string;
		counts: DeityCount;
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

	let visible = false;
	let deities: Deity[] = [];
	let loading = true;
	let error: string | null = null;

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

	onMount(() => {
		visible = true;
		fetchDeities();
	});

	// Helper function to truncate text
	function truncateText(text: string, length = 100): string {
		if (!text) return '';
		return text.length > length ? text.substring(0, length) + '...' : text;
	}
</script>

<svelte:head>
	<title>Eesh-Stuti | Hindu Prayers Collection</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
	<main>
		<!-- Hero Section -->
		<section class="relative flex h-[70vh] items-center justify-center overflow-hidden">
			<div class="absolute inset-0 z-0">
				<B2ImageViewer
					fileName={imageFileName}
					autoLoad={true}
					showFileName={false}
					width="100%"
					height="auto"
					useApiEndpoint={true}
					on:load={(e) => console.log(`Loaded: ${e.detail.fileName}`)}
					on:error={(e) => console.error(e.detail.error)}
				/>
				<!-- <UnSplashAttribution
					src="https://images.unsplash.com/photo-1603766806347-54cdf3745953?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Temple Background"
					photographUrl="<a href="https://unsplash.com/@rk_root?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ramakrishnan Nataraj</a> on <a href="https://unsplash.com/photos/brown-concrete-building-during-daytime-SzMR1Vcf5aw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>"
				/> -->
				<div class="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50"></div>
			</div>

			{#if visible}
				<div
					class="z-10 container mx-auto px-4 text-center"
					in:fade={{ duration: 1000, delay: 300 }}
				>
					<h2
						class="mb-6 text-5xl font-bold text-red-800 md:text-6xl"
						in:fly={{ y: 50, duration: 1000, delay: 300 }}
					>
						Divine Prayers for Hindu Deities
					</h2>
					<p
						class="mx-auto mb-8 max-w-3xl text-xl text-red-700 md:text-2xl"
						in:fly={{ y: 50, duration: 1000, delay: 600 }}
					>
						Discover sacred mantras, stotrams, and prayers for all Hindu Gods and Goddesses
					</p>
					<div class="flex justify-center gap-4" in:fly={{ y: 50, duration: 1000, delay: 900 }}>
						<a
							href="/deity"
							class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-red-700"
						>
							Explore Deities
						</a>
						<a
							href="/prayers"
							class="rounded-lg border border-amber-300 bg-amber-100 px-6 py-3 font-medium text-red-800 shadow transition-colors hover:bg-amber-200"
						>
							Browse Prayers
						</a>
					</div>
				</div>
			{/if}
		</section>

		<!-- Featured Deities -->
		<section class="container mx-auto px-4 py-16">
			<h2 class="mb-10 text-center text-3xl font-bold text-red-800">Featured Deities</h2>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each featured as deity, i}
					<div
						class="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
						in:fly={{ y: 50, duration: 800, delay: 300 + i * 200 }}
					>
						<B2ImageViewer
							fileName="file_1745714659529.jpeg"
							autoLoad={true}
							showFileName={false}
							width="100%"
							height="auto"
							useApiEndpoint={true}
							on:load={(e) => console.log(`Loaded: ${e.detail.fileName}`)}
							on:error={(e) => console.error(e.detail.error)}
						/>
						<div class="p-6">
							<h3 class="mb-2 text-2xl font-bold text-red-800">{deity.name}</h3>
							<p class="mb-4 text-gray-700">{deity.description}</p>
							<a
								href={`/deity/${deity.id}`}
								class="inline-block rounded-lg border border-amber-300 bg-amber-100 px-4 py-2 font-medium text-red-800 transition-colors hover:bg-amber-200"
							>
								View Prayers
							</a>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Categories -->
		<section class="bg-gradient-to-r from-red-50 to-amber-50 py-16">
			<div class="container mx-auto px-4">
				<h2 class="mb-10 text-center text-3xl font-bold text-red-800">Browse by Category</h2>

				<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
					{#each categories as category, i}
						<a
							href={`/category/${category.name.toLowerCase()}`}
							class="rounded-lg border border-amber-100 bg-white p-6 text-center shadow transition-shadow hover:border-amber-300 hover:shadow-md"
							in:fly={{ y: 30, duration: 500, delay: 200 + i * 100 }}
						>
							<h3 class="mb-2 text-xl font-bold text-red-800">{category.name}</h3>
							<p class="text-gray-600">{category.count} prayers</p>
						</a>
					{/each}
				</div>
			</div>
		</section>

		<!-- Call to Action -->
		<section class="container mx-auto px-4 py-16 text-center">
			<div class="mx-auto max-w-3xl">
				<h2 class="mb-6 text-3xl font-bold text-red-800">Begin Your Spiritual Journey</h2>
				<p class="mb-8 text-lg text-gray-700">
					Explore our extensive collection of prayers, mantras, and stotrams for all Hindu deities.
					Find peace, guidance, and spiritual connection through these sacred texts.
				</p>
				<a
					href="/prayers"
					class="inline-block rounded-lg bg-red-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-colors hover:bg-red-700"
				>
					Discover All Prayers
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
