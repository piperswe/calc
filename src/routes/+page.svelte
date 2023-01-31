<script lang="ts">
	import Category from '$lib/Category.svelte';
	import { sitemap } from '$lib/sitemap';
</script>

<svelte:head>
	<title>Piper's Calculators</title>
</svelte:head>
<ul>
	{#each sitemap as category}
		<Category {category} />
	{/each}
</ul>
