<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Hero from '$lib/components/home/Hero.svelte';
	import AvailableModels from '$lib/components/home/AvailableModels.svelte';
	import Frames from '$lib/components/home/Frames.svelte';

	const site = {
		title: "MAISONS D'ANTAN - Modernité du papier peint mural.",
		description:
			"Découvrez une incroyable variété de modèles de papier peint provenant des éditeurs de renom à travers le monde.",
		url: 'https://maisonsdantan.co',
		name: "MAISONS D'ANTAN"
	};
</script>

<MetaTags
	title={site.title}
	description={site.description}
	canonical={site.url}
	titleTemplate="%s"
	openGraph={{
		title: site.title,
		description: site.description,
		url: site.url,
		siteName: site.name
	}}
/>

<main>
	<Hero />
	<section>
		<AvailableModels />
		<Frames />
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		overflow-x: hidden;

		background-color: var(--n-color);
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--margin);

		padding: var(--margin);
		padding-left: 0;
		padding-right: 0;
	}
</style>
