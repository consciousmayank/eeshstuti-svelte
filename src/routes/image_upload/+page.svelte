<!-- image_upload/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
  
	// Define types for our data
	interface ImageFile {
	  fileName: string;
	  fileId: string;
	  uploadTimestamp: string;
	  url: string;
	}
  
	interface B2AuthResponse {
	  authorizationToken: string;
	  apiUrl: string;
	  downloadUrl: string;
	  recommendedPartSize: number;
	  absoluteMinimumPartSize: number;
	  s3ApiUrl: string;
	}
  
	interface B2UploadUrlResponse {
	  uploadUrl: string;
	  authorizationToken: string;
	  bucketId: string;
	}
  
	interface B2ListFilesResponse {
	  files: B2FileInfo[];
	  nextFileName: string | null;
	}
  
	interface B2FileInfo {
	  fileId: string;
	  fileName: string;
	  contentLength: number;
	  contentType: string;
	  contentSha1: string;
	  uploadTimestamp: number;
	  serverSideEncryption?: string;
	  fileInfo?: Record<string, string>;
	}
  //00563161c0b0cd87d7d2fad5ba01fbd7afb6e5b229 made when creating a new application master key
  // 005b847e0c7428b0000000003 made when creating a new application key having access to all buckets


	// Configuration for Backblaze B2
	const applicationKeyId = '00563161c0b0cd87d7d2fad5ba01fbd7afb6e5b229';  // Replace with your actual key ID
	const applicationKey = '005b847e0c7428b0000000003';       // Replace with your actual key
	const bucketName = 'eeshstutiBucket';               // Replace with your bucket name
	const bucketId = '9b58a4e7fe805c279462081b';                   // Replace with your bucket ID (optional if you know it)
	
	let b2Auth: B2AuthResponse | null = null;
	let isAuthenticated = false;
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';
	let images: ImageFile[] = [];
	let selectedFile: File | null = null;
	let uploadProgress = 0;
	let searchTerm = '';
  
	// Initialize authentication on component mount - only in browser
	onMount(async () => {
	  try {
		isLoading = true;
		await authenticateB2();
		await fetchImages();
	  } catch (error) {
		errorMessage = `Error initializing: ${error instanceof Error ? error.message : 'Unknown error'}`;
	  } finally {
		isLoading = false;
	  }
	});
  
	// Authenticate with B2 API
	async function authenticateB2(): Promise<void> {
	  try {
		const authString = btoa(`${applicationKeyId}:${applicationKey}`);
		
		const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
		  method: 'GET',
		  headers: {
			'Authorization': `Basic ${authString}`
		  }
		});
  
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
		}
  
		b2Auth = await response.json();
		isAuthenticated = true;
		
	  } catch (error) {
		throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	  }
	}
  
	// Handle file selection
	function handleFileSelect(event: Event): void {
	  const target = event.target as HTMLInputElement;
	  const files = target.files;
	  
	  if (files && files.length > 0) {
		selectedFile = files[0];
	  }
	}
  
	// Get upload URL from B2
	async function getUploadUrl(): Promise<B2UploadUrlResponse> {
	  if (!b2Auth) {
		throw new Error('Not authenticated');
	  }
  
	  const response = await fetch(`${b2Auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
		method: 'POST',
		headers: {
		  'Authorization': b2Auth.authorizationToken,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ bucketId })
	  });
  
	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Failed to get upload URL: ${errorData.message || response.statusText}`);
	  }
  
	  return await response.json();
	}
  
	// Upload file to B2
	async function uploadFile(): Promise<void> {
	  if (!selectedFile || !b2Auth) {
		errorMessage = 'Please select a file first or authentication failed';
		return;
	  }
  
	  try {
		isLoading = true;
		errorMessage = '';
		successMessage = '';
		uploadProgress = 0;
  
		// Get upload URL
		const uploadUrlData = await getUploadUrl();
  
		// Read file as array buffer
		const fileBuffer = await selectedFile.arrayBuffer();
  
		// Create a unique filename with timestamp
		const timestamp = new Date().getTime();
		const fileName = `${timestamp}_${selectedFile.name}`;
  
		// Prepare headers for upload
		const headers = new Headers({
		  'Authorization': uploadUrlData.authorizationToken,
		  'Content-Type': selectedFile.type || 'b2/x-auto',
		  'Content-Length': fileBuffer.byteLength.toString(),
		  'X-Bz-File-Name': encodeURIComponent(fileName), 
		  'X-Bz-Content-Sha1': 'do_not_verify' // In production, calculate SHA1 for integrity
		});
  
		// Use fetch with XMLHttpRequest for progress tracking
		const xhr = new XMLHttpRequest();
		xhr.open('POST', uploadUrlData.uploadUrl, true);
		
		// Add headers to XHR request
		headers.forEach((value, key) => {
		  xhr.setRequestHeader(key, value);
		});
		
		// Track upload progress
		xhr.upload.onprogress = (event) => {
		  if (event.lengthComputable) {
			uploadProgress = Math.round((event.loaded * 100) / event.total);
		  }
		};
		
		// Wait for XHR to complete
		const uploadResult = await new Promise<any>((resolve, reject) => {
		  xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
			  try {
				const response = JSON.parse(xhr.responseText);
				resolve(response);
			  } catch (error) {
				reject(new Error('Failed to parse response'));
			  }
			} else {
			  reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
			}
		  };
		  xhr.onerror = () => reject(new Error('Network error during upload'));
		  xhr.send(fileBuffer);
		});
  
		// Generate file URL
		const fileUrl = `${b2Auth.downloadUrl}/file/${bucketName}/${encodeURIComponent(fileName)}`;
		
		successMessage = 'File uploaded successfully!';
		
		// Refresh image list
		await fetchImages();
  
	  } catch (error) {
		errorMessage = `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
	  } finally {
		isLoading = false;
		uploadProgress = 0;
	  }
	}
  
	// Fetch images from the bucket
	async function fetchImages(): Promise<void> {
	  if (!b2Auth) {
		errorMessage = 'Not authenticated';
		return;
	  }
  
	  try {
		isLoading = true;
		errorMessage = '';
  
		// List files in the bucket
		const response = await fetch(`${b2Auth.apiUrl}/b2api/v2/b2_list_file_names`, {
		  method: 'POST',
		  headers: {
			'Authorization': b2Auth.authorizationToken,
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			bucketId,
			maxFileCount: 100,
			prefix: searchTerm,
			delimiter: ''
		  })
		});
  
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(`Failed to list files: ${errorData.message || response.statusText}`);
		}
  
		const data: B2ListFilesResponse = await response.json();
  
		// Create a list of images with their URLs
		images = data.files
		  .filter(file => {
			// Filter image files (optional: you might want to check file extensions)
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
			return imageExtensions.some(ext => file.fileName.toLowerCase().endsWith(ext));
		  })
		  .map(file => ({
			fileName: file.fileName,
			fileId: file.fileId,
			uploadTimestamp: new Date(file.uploadTimestamp).toLocaleString(),
			url: `${b2Auth!.downloadUrl}/file/${bucketName}/${encodeURIComponent(file.fileName)}`
		  }));
  
	  } catch (error) {
		errorMessage = `Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`;
	  } finally {
		isLoading = false;
	  }
	}
  
	// Search for images
	function handleSearch(): void {
	  fetchImages();
	}
  </script>
  
  <main>
	<h1>Photo Library</h1>
	
	{#if errorMessage}
	  <div class="error">{errorMessage}</div>
	{/if}
	
	{#if successMessage}
	  <div class="success">{successMessage}</div>
	{/if}
  
	<section class="upload-section">
	  <h2>Upload Image</h2>
	  <input type="file" accept="image/*" on:change={handleFileSelect} disabled={isLoading || !isAuthenticated} />
	  
	  {#if selectedFile}
		<div class="selected-file">
		  <p>Selected: {selectedFile.name}</p>
		  <button on:click={uploadFile} disabled={isLoading || !isAuthenticated}>
			{isLoading ? 'Uploading...' : 'Upload'}
		  </button>
		</div>
	  {/if}
	  
	  {#if uploadProgress > 0 && uploadProgress < 100}
		<div class="progress-bar">
		  <div class="progress" style="width: {uploadProgress}%"></div>
		</div>
	  {/if}
	</section>
  
	<section class="search-section">
	  <h2>Search Images</h2>
	  <div class="search-bar">
		<input 
		  type="text" 
		  placeholder="Search by filename..." 
		  bind:value={searchTerm}
		  on:keyup={(e) => e.key === 'Enter' && handleSearch()}
		/>
		<button on:click={handleSearch} disabled={isLoading || !isAuthenticated}>Search</button>
	  </div>
	</section>
  
	<section class="gallery">
	  <h2>Image Gallery</h2>
	  {#if isLoading}
		<div class="loading">Loading images...</div>
	  {:else if images.length === 0}
		<div class="no-images">No images found</div>
	  {:else}
		<div class="image-grid">
		  {#each images as image}
			<div class="image-card">
			  <img src={image.url} alt={image.fileName} />
			  <div class="image-info">
				<p class="image-name" title={image.fileName}>{image.fileName}</p>
				<p class="image-date">{image.uploadTimestamp}</p>
				<a href={image.url} target="_blank" rel="noopener noreferrer">View Full Size</a>
			  </div>
			</div>
		  {/each}
		</div>
	  {/if}
	</section>
  </main>
  
  <style>
	main {
	  max-width: 1200px;
	  margin: 0 auto;
	  padding: 20px;
	  font-family: Arial, sans-serif;
	}
  
	h1 {
	  text-align: center;
	  margin-bottom: 30px;
	}
  
	section {
	  margin-bottom: 40px;
	}
  
	.error {
	  background-color: #ffebee;
	  color: #c62828;
	  padding: 10px;
	  border-radius: 4px;
	  margin-bottom: 20px;
	}
  
	.success {
	  background-color: #e8f5e9;
	  color: #2e7d32;
	  padding: 10px;
	  border-radius: 4px;
	  margin-bottom: 20px;
	}
  
	.upload-section {
	  background-color: #f5f5f5;
	  padding: 20px;
	  border-radius: 8px;
	}
  
	.selected-file {
	  margin-top: 10px;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
  
	.progress-bar {
	  width: 100%;
	  height: 10px;
	  background-color: #e0e0e0;
	  border-radius: 5px;
	  margin-top: 15px;
	  overflow: hidden;
	}
  
	.progress {
	  height: 100%;
	  background-color: #4caf50;
	  transition: width 0.3s ease;
	}
  
	.search-section {
	  padding: 20px;
	  background-color: #f5f5f5;
	  border-radius: 8px;
	}
  
	.search-bar {
	  display: flex;
	  gap: 10px;
	}
  
	.search-bar input {
	  flex: 1;
	  padding: 8px;
	  border: 1px solid #ddd;
	  border-radius: 4px;
	}
  
	button {
	  padding: 8px 16px;
	  background-color: #2196f3;
	  color: white;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	}
  
	button:disabled {
	  background-color: #b0bec5;
	  cursor: not-allowed;
	}
  
	.image-grid {
	  display: grid;
	  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	  gap: 20px;
	}
  
	.image-card {
	  border-radius: 8px;
	  overflow: hidden;
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	  transition: transform 0.2s;
	}
  
	.image-card:hover {
	  transform: translateY(-5px);
	}
  
	.image-card img {
	  width: 100%;
	  height: 200px;
	  object-fit: cover;
	}
  
	.image-info {
	  padding: 10px;
	}
  
	.image-name {
	  font-weight: bold;
	  margin: 0;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
	}
  
	.image-date {
	  color: #757575;
	  font-size: 0.8rem;
	  margin: 5px 0;
	}
  
	.loading, .no-images {
	  text-align: center;
	  padding: 40px;
	  color: #757575;
	}
  
	a {
	  display: inline-block;
	  margin-top: 5px;
	  color: #2196f3;
	  text-decoration: none;
	}
  
	a:hover {
	  text-decoration: underline;
	}
  </style>