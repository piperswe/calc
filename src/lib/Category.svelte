<script lang="ts">
	import type { Category } from './sitemap';

	export let category: Category;
</script>

{category.name}
<ul>
	{#each category.subcategories as subcategory}
		<svelte:self category={subcategory} />
	{/each}
	{#each category.links as link}
		<li><a href={link.path}>{link.name}</a></li>
	{/each}
</ul>
