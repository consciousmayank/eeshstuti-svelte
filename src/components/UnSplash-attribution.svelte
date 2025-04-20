<script>
	export let src;
	export let alt = '';
	export let photographUrl;
</script>

<figure class="relative">
	<img {src} {alt} />
	<figcaption class="text-[5px] text-gray-500/2 absolute bottom-0 left-0">
		Photo by {photographUrl}
	</figcaption>
</figure>
