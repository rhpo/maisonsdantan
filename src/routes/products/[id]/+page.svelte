<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Choose from '$lib/components/ui/Choose.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Page from '$lib/components/Page.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { appConfig } from '$lib/stores/config.svelte';
	import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	import type { Model } from '$lib/types';

	let { data }: { data: PageData } = $props();

	const { product } = data;

	const materials = { poster: 'Poster', rouleau: 'En rouleau' } as const;
	type Material = keyof typeof materials;

	let selectedModelId = $state(product.models?.[0]?.id ?? 0);
	let width = $state(100);
	let height = $state(100);
	let material = $state<Material>('poster');

	let selectedModel = $derived(product.models?.find((m: Model) => m.id === selectedModelId));
	let price = $derived(appConfig.calculatePrice(width, height, material));

	function addToCart() {
		cart.add({
			id: product.id,
			model: selectedModelId,
			width,
			height,
			material,
			crop: { x: 0.5, y: 0.5 },
			product
		});
		history.back();
	}
</script>

<Page title={product.name} description={product.description}>
	<div class="layout">
		<div class="gallery">
			<Image
				src={selectedModel?.shootings?.map((s) => s.image) ?? [selectedModel?.image ?? '']}
				interval={4000}
			/>
		</div>

		<div class="details">
			<div class="header">
				<h1>{product.name}</h1>
				<p class="desc">{product.description}</p>
			</div>

			{#if product.models && product.models.length > 1}
				<div class="section">
					<label>Modèle</label>
					<div class="model-grid">
						{#each product.models as model}
							<button
								class="model-btn"
								class:active={selectedModelId === model.id}
								onclick={() => (selectedModelId = model.id)}
							>
								<div class="model-thumb">
									<img src={model.image} alt={model.name} />
								</div>
								<span>{model.name}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="section">
				<label>Matériau</label>
				<Choose
					choices={materials}
					bind:choice={material}
				/>
			</div>

			<div class="section">
				<label>Dimensions (cm)</label>
				<div class="dims">
					<Input placeholder="Largeur" bind:value={width as unknown as string} type="number" />
					<span>×</span>
					<Input placeholder="Hauteur" bind:value={height as unknown as string} type="number" />
				</div>
			</div>

			<div class="price-row">
				<span class="price">{appConfig.formatPrice(price)}</span>
			</div>

			<Button title="Ajouter au panier" icon={faShoppingBag} onclick={addToCart} />
		</div>
	</div>
</Page>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap);
		align-items: start;
	}

	.gallery {
		aspect-ratio: 3/4;
		border-radius: var(--radius);
		overflow: hidden;
		position: sticky;
		top: calc(var(--nav-height) + 1rem);
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		font-size: 2rem;
		font-family: var(--f-primary);
		text-transform: uppercase;
	}

	.desc {
		opacity: 0.6;
		font-size: 0.95rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-family: var(--f-third);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
		opacity: 0.5;
	}

	.model-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.model-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border: 2px solid transparent;
		border-radius: var(--radius);
		background: none;
		cursor: var(--cursor-pointer);
		transition: border-color var(--animation-duration);
	}

	.model-btn.active {
		border-color: var(--secondary);
	}

	.model-thumb {
		width: 60px;
		height: 60px;
		border-radius: 4px;
		overflow: hidden;
	}

	.model-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.model-btn span {
		font-family: var(--f-third);
		font-size: 0.7rem;
		text-transform: uppercase;
	}

	.dims {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dims > :global(*) { flex: 1; }
	.dims span { flex: 0; font-family: var(--f-third); }

	.price-row {
		display: flex;
		align-items: center;
	}

	.price {
		font-size: 2rem;
		font-family: var(--f-primary);
		color: rgb(3, 130, 0);
	}

	@media screen and (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.gallery {
			position: static;
			aspect-ratio: 4/3;
		}
	}
</style>
