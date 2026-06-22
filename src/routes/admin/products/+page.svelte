<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showAddForm = $state(false);

	const categories = { living: 'Salon', child: 'Enfants', kitchen: 'Cuisine', room: 'Chambre' };
	const shapes = { pattern: 'Motif', pano: 'Panoramique' };
</script>

<div class="page">
	<div class="header">
		<h1>Produits ({data.total})</h1>
		<button class="btn-primary" onclick={() => (showAddForm = !showAddForm)}>
			{showAddForm ? 'Annuler' : '+ Ajouter un produit'}
		</button>
	</div>

	{#if showAddForm}
		<div class="add-form">
			<h2>Nouveau produit</h2>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			{#if form?.success}<p class="success">Produit ajouté !</p>{/if}
			<form method="POST" action="?/add" enctype="multipart/form-data" use:enhance>
				<div class="grid-2">
					<div class="field">
						<label>Nom *</label>
						<input type="text" name="name" required />
					</div>
					<div class="field">
						<label>Nom du modèle</label>
						<input type="text" name="model_name" placeholder="Modèle 1" />
					</div>
					<div class="field">
						<label>Catégorie *</label>
						<select name="category" required>
							{#each Object.entries(categories) as [k, v]}
								<option value={k}>{v}</option>
							{/each}
						</select>
					</div>
					<div class="field">
						<label>Forme *</label>
						<select name="shape" required>
							{#each Object.entries(shapes) as [k, v]}
								<option value={k}>{v}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="field">
					<label>Description</label>
					<textarea name="description" rows="3"></textarea>
				</div>
				<div class="field">
					<label>Image du modèle *</label>
					<input type="file" name="model_image" accept="image/*" required />
				</div>
				<div class="field">
					<label>Photos de mise en scène</label>
					<input type="file" name="shootings" accept="image/*" multiple />
				</div>
				<button type="submit" class="btn-primary">Créer le produit</button>
			</form>
		</div>
	{/if}

	{#if data.products.length === 0}
		<p class="empty">Aucun produit.</p>
	{:else}
		<div class="grid">
			{#each data.products as product}
				<div class="product-card">
					<div class="product-img">
						{#if product.models?.[0]?.image}
							<img src={product.models[0].image} alt={product.name} />
						{:else}
							<div class="no-img">—</div>
						{/if}
					</div>
					<div class="product-info">
						<strong>{product.name}</strong>
						<span class="meta">{categories[product.category]} · {shapes[product.shape]}</span>
						<span class="meta">{product.models?.length ?? 0} modèle(s)</span>
					</div>
					<div class="product-actions">
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={product.id} />
							<button type="submit" class="btn-danger">Supprimer</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 { font-family: var(--f-primary); font-size: 1.8rem; }
	h2 { font-family: var(--f-primary); font-size: 1.3rem; margin-bottom: 1rem; }
	.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }

	.add-form {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	form { display: flex; flex-direction: column; gap: 1rem; }

	.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

	.field { display: flex; flex-direction: column; gap: 0.25rem; }

	label {
		font-family: var(--f-third);
		font-size: 0.75rem;
		text-transform: uppercase;
		opacity: 0.5;
	}

	input[type="text"], input[type="file"], select, textarea {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.9rem;
		background: #fafafa;
	}

	textarea { resize: vertical; }

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.product-card {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
		display: flex;
		flex-direction: column;
	}

	.product-img { aspect-ratio: 1; overflow: hidden; background: var(--sub); }
	.product-img img { width: 100%; height: 100%; object-fit: cover; }
	.no-img { display: flex; justify-content: center; align-items: center; height: 100%; opacity: 0.3; font-size: 2rem; }

	.product-info {
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		flex: 1;
	}

	.product-info strong { font-family: var(--f-third); font-size: 0.9rem; }
	.meta { font-family: var(--f-third); font-size: 0.75rem; opacity: 0.5; }

	.product-actions { padding: 0.5rem 0.75rem; }

	.btn-primary, .btn-danger {
		padding: 0.4rem 1rem;
		border: none;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.8rem;
		cursor: var(--cursor-pointer);
		width: 100%;
	}
	.btn-primary { background: var(--secondary); color: white; }
	.btn-danger { background: #fee2e2; color: #991b1b; }
	.btn-danger:hover { background: #fca5a5; }

	.error { color: #991b1b; font-family: var(--f-third); font-size: 0.85rem; }
	.success { color: #0f5132; font-family: var(--f-third); font-size: 0.85rem; }
	.empty { opacity: 0.5; font-family: var(--f-third); }
</style>
