<script>
	import Header from '../components/Header.svelte';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import UnSplashAttribution from '../components/UnSplash-attribution.svelte';
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

<footer class="bg-red-900 py-12 text-white">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<div>
					<div class="mb-4 flex items-center gap-3">
						<Om />
						<h3 class="text-xl font-bold">Eesh-Stuti</h3>
					</div>
					<p class="text-amber-200">
						A comprehensive collection of prayers and mantras for Hindu deities.
					</p>
				</div>

				<div>
					<h4 class="mb-4 text-lg font-bold">Quick Links</h4>
					<ul class="space-y-2">
						<li><a href="/" class="transition-colors hover:text-amber-200">Home</a></li>
						<li><a href="/deities" class="transition-colors hover:text-amber-200">Deities</a></li>
						<li><a href="/prayers" class="transition-colors hover:text-amber-200">Prayers</a></li>
						<li><a href="/about" class="transition-colors hover:text-amber-200">About</a></li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 text-lg font-bold">Popular Deities</h4>
					<ul class="space-y-2">
						<li>
							<a href="/deity/ganesha" class="transition-colors hover:text-amber-200">Ganesha</a>
						</li>
						<li>
							<a href="/deity/lakshmi" class="transition-colors hover:text-amber-200">Lakshmi</a>
						</li>
						<li><a href="/deity/shiva" class="transition-colors hover:text-amber-200">Shiva</a></li>
						<li>
							<a href="/deity/krishna" class="transition-colors hover:text-amber-200">Krishna</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="mb-4 text-lg font-bold">Contact</h4>
					<p class="mb-2">Have suggestions or questions?</p>
					<a href="/contact" class="text-amber-300 transition-colors hover:text-amber-200"
						>Contact Us</a
					>
				</div>
			</div>

			<div class="mt-8 border-t border-red-800 pt-8 text-center text-amber-200">
				<p>&copy; {new Date().getFullYear()} Eesh-Stuti. All rights reserved.</p>
			</div>
		</div>
	</footer>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

	:global(body) {
		font-family: 'Poppins', sans-serif;
		color: #4b5563;
	}
</style>

