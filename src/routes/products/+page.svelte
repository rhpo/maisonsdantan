<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import {
		faSearch,
		faSpinner,
		faFaceSadCry,
		faListAlt,
		faCircleCheck
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Image from '$lib/components/Image.svelte';
	import Choose from '$lib/components/ui/Choose.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Indexer from '$lib/components/ui/Indexer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/Container.svelte';
	import Long from '$lib/components/ui/Long.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categories = { all: 'Pièces', child: 'Enfants', living: 'Salon', kitchen: 'Cuisine', room: 'Chambre' };
	const shapes = { all: 'Papier peint', pano: 'Panoramique', pattern: 'Motif' };
	const sorts = { date: 'Nouveautés', name: 'Nom', popularity: 'Best Sellers' };

	let category = $state(data.filters.category);
	let shape = $state(data.filters.shape);
	let sort = $state(data.filters.sort);
	let search = $state(data.filters.q);
	let currentPage = $state(data.page);
	let filterMenuOpen = $state(false);

	let debounce: ReturnType<typeof setTimeout>;

	function applyFilters() {
		const params = new URLSearchParams({
			category,
			shape,
			sort,
			q: search,
			page: String(currentPage)
		});
		goto(`/products?${params}`, { replaceState: true });
	}

	$effect(() => {
		[category, shape, sort, currentPage];
		clearTimeout(debounce);
		debounce = setTimeout(applyFilters, 100);
	});

	$effect(() => {
		search;
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			currentPage = 1;
			applyFilters();
		}, 600);
	});

	let loading = $derived($page.state !== undefined ? false : false);
</script>

{#if filterMenuOpen}
	<div class="filter-overlay" transition:slide={{ axis: 'y', duration: 200 }}>
		<div class="overlay-content">
			<div class="filter-group">
				<Choose choices={categories} bind:choice={category} name="Pièce" />
				<Choose choices={shapes} bind:choice={shape} name="Format" />
				<Choose choices={sorts} bind:choice={sort} name="Trier" />
			</div>
			<Button
				title="Appliquer"
				icon={faCircleCheck}
				onclick={() => (filterMenuOpen = false)}
			/>
		</div>
	</div>
{/if}

<div class="bartop">
	<Container>
		<div class="bar-inner">
			{#if data.total > data.limit}
				<div class="pager">
					<Indexer bind:page={currentPage} total={data.total} limit={data.limit} />
				</div>
			{/if}
			<div class="bar-controls">
				<div class="choices">
					<Choose choices={categories} bind:choice={category} name="" />
					<Choose choices={shapes} bind:choice={shape} name="" />
					<Choose choices={sorts} bind:choice={sort} name="" />
				</div>
				<button class="filter-btn" onclick={() => (filterMenuOpen = true)}>
					<Fa icon={faListAlt} /> Filtrer
				</button>
				<div class="searchbar">
					<Input icon={faSearch} placeholder="Rechercher..." bind:value={search} />
				</div>
			</div>
		</div>
	</Container>
</div>

<div class="page-wrap">
	<Container>
		<div class="wrapper">
			{#if data.products.length === 0}
				<div class="empty" transition:fade>
					<Fa icon={faFaceSadCry} />
					<h2>Aucun produit trouvé</h2>
				</div>
			{:else}
				<div class="grid">
					{#each data.products as product (product.id)}
						<a class="product" href="/products/{product.id}" title={product.description}>
							<div class="img-wrap">
								<Image
									src={product.models?.flatMap((m) => m.shootings?.map((s) => s.image) ?? []) ?? []}
									interval={5000}
								/>
							</div>
							<div class="info">
								<div class="branding">
									<h3 class:smaller={product.name.length > 16}>{product.name}</h3>
									<p class="meta">{shapes[product.shape]} | {categories[product.category]}</p>
								</div>
								<p class="desc"><Long text={product.description} /></p>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</Container>
</div>

<style>
	.bartop {
		background-color: var(--primary);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		position: fixed;
		z-index: 100;
		top: var(--nav-height);
		left: 0;
		width: 100%;
		height: var(--preferences-height);
		display: flex;
		align-items: center;
	}

	.bar-inner {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: 100%;
	}

	.bar-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.choices {
		display: flex;
		gap: 0.5rem;
	}

	.choices > :global(*) { flex: 1; }

	.searchbar { flex: 1; }

	.filter-btn {
		display: none;
		gap: 0.4rem;
		align-items: center;
		padding: 0.5rem 0.8rem;
		border: 1px solid #ccc;
		border-radius: var(--radius);
		background: white;
		font-family: var(--f-third);
		font-size: 0.85rem;
		cursor: var(--cursor-pointer);
		white-space: nowrap;
	}

	.pager {
		display: flex;
		justify-content: center;
	}

	.page-wrap {
		padding-top: calc(var(--nav-height) + var(--preferences-height) + 1rem);
		min-height: 100vh;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--gap);
	}

	.product {
		display: flex;
		flex-direction: column;
		border: 1px solid #ccc;
		border-radius: var(--radius);
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: box-shadow var(--animation-duration);
	}

	.product:hover {
		box-shadow: 0 4px 20px rgba(0,0,0,0.1);
	}

	.img-wrap {
		aspect-ratio: 16/14;
		overflow: hidden;
	}

	.product:hover :global(img) {
		transform: scale(1.05);
	}

	.info {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	h3 {
		font-family: var(--f-primary);
		text-transform: uppercase;
		font-size: 1.2rem;
	}

	h3.smaller { font-size: 0.95rem; }

	.meta {
		font-family: var(--f-third);
		font-size: 0.7rem;
		text-transform: uppercase;
		opacity: 0.5;
	}

	.desc {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-height: 40vh;
		font-size: 2rem;
		opacity: 0.4;
	}

	.empty h2 { font-size: 1.4rem; }

	.filter-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: rgba(255,255,255,0.95);
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.overlay-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 400px;
		padding: 2rem;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.wrapper { padding-bottom: var(--gap); }

	@media screen and (max-width: 500px) {
		.choices { display: none; }
		.filter-btn { display: flex; }
	}
</style>
