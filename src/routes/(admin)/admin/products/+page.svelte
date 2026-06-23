<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import { faSearch, faTrashCan, faAdd, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';
	import Loading from '$lib/components/admin/Loading.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddForm = $state(false);
	let searchValue = $state('');
	let submitting = $state(false);

	const track = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	// dynamic variants — each becomes one model with its own shooting images
	let variants = $state<{ key: string }[]>([{ key: crypto.randomUUID() }]);

	function addVariant() {
		variants = [...variants, { key: crypto.randomUUID() }];
	}
	function removeVariant(key: string) {
		variants = variants.filter((v) => v.key !== key);
	}

	const categories: Record<string, string> = {
		living: 'Salon',
		child: 'Enfants',
		kitchen: 'Cuisine',
		room: 'Chambre'
	};
	const shapes: Record<string, string> = { pattern: 'Motif', pano: 'Panoramique' };

	let filtered = $derived(
		data.products.filter(
			(product) =>
				product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
				product.id.toString().includes(searchValue)
		)
	);
</script>

<Loading show={submitting} />

<main>
	<div class="section add">
		<div class="head">
			<h2>Ajouter un Modèle</h2>
			<button class="toggle" onclick={() => (showAddForm = !showAddForm)}>
				{showAddForm ? 'Annuler' : '+ Ajouter un produit'}
			</button>
		</div>

		{#if showAddForm}
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			{#if form?.success}<p class="success">Produit ajouté !</p>{/if}
			<form
				method="POST"
				action="?/add"
				enctype="multipart/form-data"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
			>
				<div class="data">
					<div class="choices">
						<div class="choose">
							<p>Type du papier peint</p>
							<select name="shape" required>
								{#each Object.entries(shapes) as [k, v]}
									<option value={k}>{v}</option>
								{/each}
							</select>
						</div>
						<div class="choose">
							<p>Catégorie du papier peint</p>
							<select name="category" required>
								{#each Object.entries(categories) as [k, v]}
									<option value={k}>{v}</option>
								{/each}
							</select>
						</div>
					</div>

					<input type="text" name="name" placeholder="Nom du Modèle" required />
					<textarea name="description" placeholder="Description du Modèle" rows="3"></textarea>
				</div>

				<h3 class="variants-title">Variantes ({variants.length})</h3>

				<input type="hidden" name="variant_count" value={variants.length} />

				<div class="variants">
					{#each variants as variant, i (variant.key)}
						<div class="variant">
							<div class="variant-head">
								<input
									type="text"
									name={`variant_name_${i}`}
									placeholder={`Nom (Variant ${i + 1})`}
									required
								/>
								{#if variants.length > 1}
									<button
										type="button"
										class="del-variant"
										onclick={() => removeVariant(variant.key)}
										aria-label="Supprimer le variant"
									>
										<Fa icon={faTrashCan} />
									</button>
								{/if}
							</div>

							<label class="file">
								Shootings (une ou plusieurs images)
								<input
									type="file"
									name={`variant_shootings_${i}`}
									accept="image/*"
									multiple
									required
								/>
							</label>
						</div>
					{/each}
				</div>

				<div class="actions">
					<button type="button" class="add-variant" onclick={addVariant}>
						<Fa icon={faAdd} /> Ajouter Variant
					</button>
					<button type="submit" class="publish">
						<Fa icon={faGlobeAfrica} /> Publier le modèle
					</button>
				</div>
			</form>
		{/if}
	</div>

	<div class="section">
		<h2>Modèles Disponibles ({data.products.length})</h2>

		<div class="searchbar">
			<span class="icon"><Fa icon={faSearch} /></span>
			<input bind:value={searchValue} placeholder="Trouver un Modèle par Nom / ID" />
		</div>

		<div class="products">
			{#if filtered.length === 0}
				<h3 class="empty">Aucun modèle trouvé.</h3>
			{:else}
				{#each filtered as product}
					<div class="product">
						<div class="text">
							<h3 class="name">{product.name}</h3>
							<p class="id">#{product.id}</p>
							<p class="description">{product.description}</p>

							<div class="properties">
								<p class="property">Type &nbsp;<strong>{product.shape}</strong></p>
								<p class="property">Catégorie &nbsp;<strong>{product.category}</strong></p>
							</div>

							<div class="card-actions">
								<form method="POST" action="?/delete" use:enhance={track}>
									<input type="hidden" name="id" value={product.id} />
									<button type="submit" class="remove">
										<Fa icon={faTrashCan} /> Supprimer
									</button>
								</form>
							</div>
						</div>

						<div class="visual">
							{#if product.models?.[0]?.image}
								<img src={product.models[0].image} alt={product.name} />
							{:else}
								<div class="no-img">—</div>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.toggle {
		border: none;
		background: black;
		color: white;
		border-radius: var(--radius);
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 600;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.data {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.choices {
		display: flex;
		gap: 0.5rem;
	}

	.choices > * {
		flex: 1;
	}

	.choose {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	input[type='text'],
	select,
	textarea,
	.file input {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: var(--radius);
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		background: #fafafa;
		width: 100%;
	}

	.file {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.85rem;
	}

	.variants-title {
		margin-top: 0.5rem;
	}

	.variants {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.variant {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 16px;
		background-color: #f8f8f8;
		border: 1px solid #eee;
	}

	.variant-head {
		display: flex;
		gap: 0.5rem;
		align-items: stretch;
	}

	.del-variant {
		flex-shrink: 0;
		border: none;
		background: red;
		color: white;
		border-radius: var(--radius);
		padding: 0 0.75rem;
		cursor: pointer;
	}

	.actions {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
	}

	.add-variant {
		border: 1px solid #ccc;
		background: white;
		color: black;
		border-radius: var(--radius);
		padding: 10px 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.publish {
		border: none;
		background: black;
		color: white;
		border-radius: var(--radius);
		padding: 10px 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.searchbar {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: var(--radius);
		background: #fafafa;
		margin: 0.5rem 0;
		overflow: hidden;
	}

	.searchbar .icon {
		padding: 0 0.6rem;
		opacity: 0.5;
	}

	.searchbar input {
		flex: 1;
		border: none;
		background: transparent;
		padding: 0.5rem;
		outline: none;
		font-family: 'Inter', sans-serif;
	}

	.products {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1rem;

		padding-top: 0.5rem;
	}

	.product {
		background-color: #efefef;
		padding: 1rem;

		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.text,
	.text * {
		font-family: 'Montserrat', sans-serif;
		text-transform: uppercase;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.product .description {
		font-size: 0.8rem;
	}

	.properties {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.card-actions {
		padding-top: 0.5rem;
	}

	.remove {
		border: none;
		background: red;
		color: white;
		border-radius: var(--radius);
		padding: 8px 14px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.visual {
		width: 150px;
		min-width: 150px;
		aspect-ratio: 1;
	}

	.visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-img {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		opacity: 0.3;
		font-size: 2rem;
		background: #ddd;
	}

	.error {
		color: #991b1b;
		margin-top: 1rem;
	}

	.success {
		color: #0f5132;
		margin-top: 1rem;
	}
</style>
