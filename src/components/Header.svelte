<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import UnSplashAttribution from './UnSplash-attribution.svelte';
	import Om from './Om.svelte';

	let featured = [
		{
			id: 'ganesha',
			name: 'Lord Ganesha',
			description: 'Remover of Obstacles, God of New Beginnings',
			image:
				'https://images.unsplash.com/photo-1567591414240-e9c0cc916440?q=80&w=1000&auto=format&fit=crop'
		},
		{
			id: 'lakshmi',
			name: 'Goddess Lakshmi',
			description: 'Goddess of Wealth, Fortune and Prosperity',
			image:
				'https://images.unsplash.com/photo-1618767451283-1e3ae0343b1c?q=80&w=1000&auto=format&fit=crop'
		},
		{
			id: 'krishna',
			name: 'Lord Krishna',
			description: 'God of Compassion, Tenderness and Love',
			image:
				'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1000&auto=format&fit=crop'
		}
	];

	let categories = [
		{ name: 'Vishnu', count: 12 },
		{ name: 'Shiva', count: 15 },
		{ name: 'Shakti', count: 10 },
		{ name: 'Ganesha', count: 8 },
		{ name: 'Hanuman', count: 6 },
		{ name: 'Surya', count: 4 }
	];

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<header class="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
	<div class="container mx-auto flex items-center justify-between px-4 py-6">
		<div class="flex items-center gap-3">
			<!-- <img
				src="https://img.icons8.com/color/96/000000/om-symbol.png"
				alt="Om Symbol"
				class="h-10 w-10"
			/> -->
			<Om />
			<h1 class="text-2xl font-bold">Eesh-Stuti</h1>
		</div>
		<nav class="hidden gap-6 md:flex">
			<a href="/" class="font-medium transition-colors hover:text-amber-200">Home</a>
			<a href="/deities" class="font-medium transition-colors hover:text-amber-200">Deities</a>
			<a href="/prayers" class="font-medium transition-colors hover:text-amber-200">Prayers</a>
			<a href="/about" class="font-medium transition-colors hover:text-amber-200">About</a>
		</nav>
		<button class="text-2xl md:hidden">☰</button>
	</div>
</header>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

	:global(body) {
		font-family: 'Poppins', sans-serif;
		color: #4b5563;
	}
	
	:global(.filter-white) {
		filter: brightness(0) invert(1);
	}
</style>
