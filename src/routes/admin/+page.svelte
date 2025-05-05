<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { B2ImageUploader } from 'b2-image-tools/components';

	// Using type annotations with 'any' to explicitly acknowledge types
	let activeTab = 'deities';
	let deities: any[] = [];
	let prayerTypes: any[] = [];
	let prayers: any[] = [];
	let occasions: any[] = [];
	let loading = true;
	let error: string | null = null;

	// Form states
	let newDeity = { name: '', description: '', imageName: '' };
	let newPrayer = { name: '', content: '', type: 'mantra', translation: '', deityId: '' };
	let newPrayerType = { name: '' };
	// Edit modal state
	let showEditModal = false;
	let editingDeity: any = null;
	let editName = '';
	let editDescription = '';
	let savingChanges = false;
	let saveError: string | null = null;

	function handleFileSelect(event: any) {
		const { file } = event.detail;
		console.log('File selected:', file.name);
	}

	function handleUploadStart(event: any) {
		const { file } = event.detail;
		console.log('Upload started for:', file.name);
	}

	function handleUploadProgress(event: any) {
		const { file, progress } = event.detail;
		console.log(`Upload progress for ${file.name}: ${progress}%`);
	}

	function handleUploadSuccess(event: any) {
		console.log('Upload successful!');
		console.log('File URL:', event.detail.fileUrl);
		console.log('File Name:', event.detail.fileName);

		// Save the fileName to the deity form
		newDeity.imageName = event.detail.fileName;
	}

	function handleUploadError(event: any) {
		const { error, file } = event.detail;
		console.error('Upload failed:', error);
		if (file) {
			console.error('For file:', file.name);
		}
	}

	// Access component method
	let uploaderComponent: any;

	function resetUploader() {
		// Programmatically reset the uploader
		uploaderComponent.reset();
	}

	async function fetchData() {
		try {
			loading = true;

			// Fetch deities
			const deitiesResponse = await fetch('/api/deities');
			if (!deitiesResponse.ok) throw new Error('Failed to load deities');
			deities = await deitiesResponse.json();

			// Fetch prayers
			const prayersResponse = await fetch('/api/prayers');
			if (!prayersResponse.ok) throw new Error('Failed to load prayers');
			prayers = await prayersResponse.json();

			// Fetch occasions
			const occasionsResponse = await fetch('/api/occasions');
			if (!occasionsResponse.ok) throw new Error('Failed to load occasions');
			occasions = await occasionsResponse.json();

			// Fetch prayer types
			const prayerTypesResponse = await fetch('/api/prayer-type');
			if (!prayerTypesResponse.ok) throw new Error('Failed to load prayer types');
			prayerTypes = await prayerTypesResponse.json();

			loading = false;
		} catch (e: unknown) {
			console.error('Error fetching data:', e);
			error = e instanceof Error ? e.message : 'Unknown error';
			loading = false;
		}
	}

	// Create new deity
	async function createDeity() {
		try {
			// Validate that an image has been uploaded
			if (!newDeity.imageName) {
				error = 'Please upload an image for the deity';
				return;
			}

			const response = await fetch('/api/deities', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newDeity)
			});

			if (!response.ok) throw new Error('Failed to create deity');

			// Reset form and refresh data
			newDeity = { name: '', description: '', imageName: '' };
			uploaderComponent.reset(); // Reset the uploader
			error = null;
			await fetchData();
		} catch (e: unknown) {
			console.error('Error creating deity:', e);
			error = e instanceof Error ? e.message : 'Unknown error';
		}
	}

	// Create new prayer type
	async function createPrayerType() {
		try {
			const response = await fetch('/api/prayer-type', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newPrayerType)
			});

			if (!response.ok) throw new Error(response.statusText);

			// Reset form and refresh data
			newPrayerType = { name: '' };
			await fetchData();
		} catch (e: unknown) {
			console.error('Error creating prayer type:', e);
			error = e instanceof Error ? e.message : 'Unknown error';
		}
	}

	// Create new prayer
	async function createPrayer() {
		try {
			const response = await fetch('/api/prayers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newPrayer)
			});

			if (!response.ok) throw new Error('Failed to create prayer');

			// Reset form and refresh data
			newPrayer = { name: '', content: '', type: 'mantra', translation: '', deityId: '' };
			await fetchData();
		} catch (e: unknown) {
			console.error('Error creating prayer:', e);
			error = e instanceof Error ? e.message : 'Unknown error';
		}
	}

	// Open edit modal
	function openEditModal(deity: any) {
		editingDeity = deity;
		editName = deity.name;
		editDescription = deity.description || '';
		editingDeity.imageName = deity.imageName || '';
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
					description: editDescription,
					imageName: editingDeity.imageName
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update deity');
			}

			// Update local deity data
			const updatedDeity = await response.json();
			deities = deities.map((d) =>
				d.id === editingDeity.id
					? {
							...d,
							name: editName,
							description: editDescription,
							imageName: editingDeity.imageName
						}
					: d
			);

			// Close modal
			closeEditModal();
		} catch (e: unknown) {
			console.error('Error updating deity:', e);
			saveError = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			savingChanges = false;
		}
	}

	onMount(fetchData);
</script>

<svelte:head>
	<title>Admin Dashboard | Eesh-Stuti</title>
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<header class="bg-white shadow">
		<div class="container mx-auto px-4 py-6">
			<h1 class="text-2xl font-bold text-gray-800">Eesh-Stuti Admin</h1>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		{#if error}
			<div class="mb-6 rounded-md bg-red-100 p-4 text-red-700">
				<p>{error}</p>
			</div>
		{/if}

		<div class="mb-6 flex space-x-4 border-b border-gray-200">
			<button
				class={`px-4 pb-3 ${activeTab === 'deities' ? 'border-b-2 border-red-600 font-medium text-red-600' : 'text-gray-600 hover:text-red-600'}`}
				on:click={() => (activeTab = 'deities')}
			>
				Deities
			</button>
			
			<button
				class={`px-4 pb-3 ${activeTab === 'prayers type' ? 'border-b-2 border-red-600 font-medium text-red-600' : 'text-gray-600 hover:text-red-600'}`}
				on:click={() => (activeTab = 'prayers type')}
			>
				Prayers Type
			</button>
			<button
				class={`px-4 pb-3 ${activeTab === 'prayers' ? 'border-b-2 border-red-600 font-medium text-red-600' : 'text-gray-600 hover:text-red-600'}`}
				on:click={() => (activeTab = 'prayers')}
			>
				Prayers
			</button>
			<button
				class={`px-4 pb-3 ${activeTab === 'occasions' ? 'border-b-2 border-red-600 font-medium text-red-600' : 'text-gray-600 hover:text-red-600'}`}
				on:click={() => (activeTab = 'occasions')}
			>
				Occasions
			</button>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div
					class="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent"
				></div>
				<span class="ml-2 text-gray-600">Loading...</span>
			</div>
		{:else}
			<!-- Deities Tab -->
			{#if activeTab === 'deities'}
				<div class="mb-8">
					<h2 class="mb-4 text-xl font-bold text-gray-800">Add New Deity</h2>
					<form
						on:submit|preventDefault={createDeity}
						class="mb-6 rounded-lg bg-white p-6 shadow-md"
					>
						<div class="grid grid-cols-2">
							<div>
								<div class="mb-4">
									<label for="image" class="mb-2 block text-sm font-medium text-gray-700"
										>Upload Image</label
									>
									<B2ImageUploader
										bind:this={uploaderComponent}
										maxSizeMB={5}
										acceptedTypes="image/jpeg,image/png,image/gif"
										showPreview={true}
										autoUpload={true}
										useApiEndpoint={true}
										buttonText="Upload Image"
										dropzoneText="Drag and drop an image, or click to browse"
										on:select={handleFileSelect}
										on:start={handleUploadStart}
										on:progress={handleUploadProgress}
										on:success={handleUploadSuccess}
										on:error={handleUploadError}
									/>
								</div>
							</div>
							<div>
								<div class="mb-4">
									<label for="name" class="mb-2 block text-sm font-medium text-gray-700">Name</label
									>
									<input
										type="text"
										id="name"
										bind:value={newDeity.name}
										required
										class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
									/>
								</div>
								<div class="mb-4">
									<label for="fileName" class="mb-2 block text-sm font-medium text-gray-700">Image File Name</label
									>
									<input
										type="text"
										id="fileName"
										bind:value={newDeity.imageName}
										readonly
										placeholder="File name will be populated after upload"
										class="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 focus:border-red-500 focus:outline-none"
									/>
								</div>
								<div class="mb-4">
									<label for="description" class="mb-2 block text-sm font-medium text-gray-700"
										>Description</label
									>
									<textarea
										id="description"
										bind:value={newDeity.description}
										rows="3"
										class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
									></textarea>
								</div>
							</div>
						</div>

						<div class="flex justify-end">
							<button
								type="submit"
								class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none"
								>Add Deity</button
							>
						</div>
					</form>

					<h2 class="mb-4 text-xl font-bold text-gray-800">Existing Deities</h2>
					<div class="overflow-x-auto rounded-lg bg-white shadow-md">
						<table class="min-w-full">
							<thead class="border-b bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Name</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Description
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Image
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each deities as deity}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{deity.id}</td>
										<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
											{deity.name}
										</td>
										<td class="px-6 py-4 text-sm text-gray-500">
											{deity.description || 'No description'}
										</td>
										<td class="px-6 py-4 text-sm text-gray-500">
											{deity.imageName || 'No image'}
										</td>
										<td class="flex gap-2 px-6 py-4 text-sm whitespace-nowrap">
											<button
												on:click={() => openEditModal(deity)}
												class="text-blue-600 hover:text-blue-800 hover:underline">Edit</button
											>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
											No deities found
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Prayers Type Tab -->
			{#if activeTab === 'prayers type'}
				<div class="mb-8">
					<h2 class="mb-4 text-xl font-bold text-gray-800">Add New Prayer Type</h2>
					<form
						on:submit|preventDefault={createPrayerType}
						class="mb-6 rounded-lg bg-white p-6 shadow-md"
					>
						<div class="mb-4">
							<label for="prayerTypeName" class="mb-2 block text-sm font-medium text-gray-700"
								>Name</label
							>
							<input
								type="text"
								id="prayerTypeName"
								bind:value={newPrayerType.name}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							/>
						</div>
						<button
							type="submit"
							class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none"
							>Add Prayer Type</button
						>
					</form>

					<h2 class="mb-4 text-xl font-bold text-gray-800">Existing Prayer Types</h2>
					<div class="overflow-x-auto rounded-lg bg-white shadow-md">
						<table class="min-w-full">
							<thead class="border-b bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Name
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each prayerTypes as prayerType}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
											{prayerType.name}
										</td>
										<td class="flex gap-2 px-6 py-4 text-sm whitespace-nowrap">
											<button
												on:click={() => openEditModal(prayerType)}
												class="text-blue-600 hover:text-blue-800 hover:underline">Edit</button
											>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500">
											No prayer types found
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Prayers Tab -->
			{#if activeTab === 'prayers'}
				<div class="mb-8">
					<h2 class="mb-4 text-xl font-bold text-gray-800">Add New Prayer</h2>
					<form
						on:submit|preventDefault={createPrayer}
						class="mb-6 rounded-lg bg-white p-6 shadow-md"
					>
						<div class="mb-4">
							<label for="prayerName" class="mb-2 block text-sm font-medium text-gray-700"
								>Name</label
							>
							<input
								type="text"
								id="prayerName"
								bind:value={newPrayer.name}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							/>
						</div>
						<div class="mb-4">
							<label for="prayerType" class="mb-2 block text-sm font-medium text-gray-700"
								>Type</label
							>
							<select
								id="prayerType"
								bind:value={newPrayer.type}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							>
								<option value="mantra">Mantra</option>
								<option value="stotram">Stotram</option>
								<option value="prayer">Prayer</option>
								<option value="ashtakam">Ashtakam</option>
							</select>
						</div>
						<div class="mb-4">
							<label for="prayerContent" class="mb-2 block text-sm font-medium text-gray-700"
								>Content</label
							>
							<textarea
								id="prayerContent"
								bind:value={newPrayer.content}
								rows="5"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							></textarea>
						</div>
						<div class="mb-4">
							<label for="prayerTranslation" class="mb-2 block text-sm font-medium text-gray-700"
								>Translation</label
							>
							<textarea
								id="prayerTranslation"
								bind:value={newPrayer.translation}
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							></textarea>
						</div>
						<div class="mb-4">
							<label for="prayerDeity" class="mb-2 block text-sm font-medium text-gray-700"
								>Deity</label
							>
							<select
								id="prayerDeity"
								bind:value={newPrayer.deityId}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
							>
								<option value="">Select a deity</option>
								{#each deities as deity}
									<option value={deity.id}>{deity.name}</option>
								{/each}
							</select>
						</div>
						<button
							type="submit"
							class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none"
							>Add Prayer</button
						>
					</form>

					<h2 class="mb-4 text-xl font-bold text-gray-800">Existing Prayers</h2>
					<div class="overflow-x-auto rounded-lg bg-white shadow-md">
						<table class="min-w-full">
							<thead class="border-b bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Name</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Type</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Deity
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each prayers as prayer}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
											{prayer.name}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{prayer.type}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{prayer.deity.name}
										</td>
										<td class="flex gap-2 px-6 py-4 text-sm whitespace-nowrap">
											<a
												href={`/admin/prayers/${prayer.id}`}
												class="text-blue-600 hover:text-blue-800 hover:underline">Edit</a
											>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
											No prayers found
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}

			<!-- Occasions Tab -->
			{#if activeTab === 'occasions'}
				<div class="mb-8">
					<h2 class="mb-4 text-xl font-bold text-gray-800">Occasions</h2>
					<div class="overflow-x-auto rounded-lg bg-white shadow-md">
						<table class="min-w-full">
							<thead class="border-b bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Name</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
										>Date</th
									>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Deities
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each occasions as occasion}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
											{occasion.name}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{occasion.date || 'N/A'}
										</td>
										<td class="px-6 py-4 text-sm text-gray-500">
											{occasion.deities.map((od: any) => od.deity.name).join(', ') || 'None'}
										</td>
										<td class="flex gap-2 px-6 py-4 text-sm whitespace-nowrap">
											<a
												href={`/admin/occasions/${occasion.id}`}
												class="text-blue-600 hover:text-blue-800 hover:underline">Edit</a
											>
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
											No occasions found
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		{/if}
	</main>
</div>

<!-- Edit Deity Modal -->
{#if showEditModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
			in:fly={{ y: 20, duration: 300 }}
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-800">Edit Deity</h2>
				<button
					aria-label="Close"
					on:click={closeEditModal}
					class="text-gray-500 hover:text-gray-700 focus:outline-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
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
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
						required
					/>
				</div>

				<div class="mb-4">
					<label for="deityImageName" class="mb-1 block text-sm font-medium text-gray-700"
						>Image Name</label
					>
					<input
						type="text"
						id="deityImageName"
						bind:value={editingDeity.imageName}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
					/>
				</div>

				<div class="mb-6">
					<label for="deityDescription" class="mb-1 block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="deityDescription"
						bind:value={editDescription}
						rows="4"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
					></textarea>
				</div>

				<div class="flex justify-end space-x-3">
					<button
						type="button"
						on:click={closeEditModal}
						class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						disabled={savingChanges}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						disabled={savingChanges}
					>
						{#if savingChanges}
							<span class="flex items-center">
								<svg
									class="mr-2 h-4 w-4 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
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
