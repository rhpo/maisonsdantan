<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const materials: Record<string, string> = { poster: 'Poster', rouleau: 'Rouleau' };
</script>

<div class="page">
	<div class="header">
		<h1>Commandes ({data.orders.length})</h1>
		<form method="POST" action="?/markAllRead" use:enhance>
			<button type="submit" class="btn-secondary">Tout marquer comme lu</button>
		</form>
	</div>

	{#if data.orders.length === 0}
		<p class="empty">Aucune commande.</p>
	{:else}
		<div class="list">
			{#each data.orders as order}
				<div class="order" class:unread={!order.read} class:completed={!order.pending}>
					<div class="order-header">
						<div>
							<span class="order-id">#{order.id}</span>
							<span class="badge" class:pending={order.pending} class:done={!order.pending}>
								{order.pending ? 'En attente' : 'Complétée'}
							</span>
						</div>
						<span class="date">{new Date(order.created_at).toLocaleString('fr-FR')}</span>
					</div>

					<div class="order-body">
						<div class="customer">
							<strong>{order.info?.name}</strong>
							<span>{order.info?.phone}</span>
							<span>{order.info?.email}</span>
							<span class="address">{order.info?.address}</span>
						</div>

						<div class="cart">
							{#each order.cart as item}
								<div class="item">
									Produit #{item.id} · Modèle #{item.model} · {item.width}×{item.height}cm · {materials[item.material] ?? item.material}
								</div>
							{/each}
						</div>
					</div>

					<div class="order-actions">
						{#if order.pending}
							<form method="POST" action="?/complete" use:enhance>
								<input type="hidden" name="id" value={order.id} />
								<button type="submit" class="btn-primary">Marquer complétée</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={order.id} />
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
	.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
	.list { display: flex; flex-direction: column; gap: 1rem; }

	.order {
		background: white;
		border-radius: 8px;
		padding: 1.25rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
		border-left: 4px solid transparent;
	}
	.order.unread { border-left-color: #3b82f6; }
	.order.completed { opacity: 0.7; }

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.order-id { font-family: var(--f-third); font-weight: 700; margin-right: 0.5rem; }
	.date { font-family: var(--f-third); font-size: 0.8rem; opacity: 0.5; }

	.badge { padding: 0.15rem 0.5rem; border-radius: 20px; font-size: 0.75rem; font-family: var(--f-third); }
	.badge.pending { background: #fff3cd; color: #856404; }
	.badge.done { background: #d1e7dd; color: #0f5132; }

	.order-body { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }

	.customer {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-family: var(--f-third);
		font-size: 0.85rem;
	}

	.customer strong { font-size: 1rem; }
	.address { opacity: 0.6; font-size: 0.8rem; }

	.cart { display: flex; flex-direction: column; gap: 0.25rem; }
	.item { font-family: var(--f-third); font-size: 0.8rem; background: var(--sub); padding: 0.3rem 0.6rem; border-radius: 4px; }

	.order-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }

	.btn-primary, .btn-secondary, .btn-danger {
		padding: 0.4rem 1rem;
		border: none;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.8rem;
		cursor: var(--cursor-pointer);
		transition: all var(--animation-duration);
	}
	.btn-primary { background: var(--secondary); color: white; }
	.btn-secondary { background: var(--sub); color: var(--secondary); border: 1px solid #ddd; }
	.btn-danger { background: #fee2e2; color: #991b1b; }
	.btn-danger:hover { background: #fca5a5; }

	.empty { opacity: 0.5; font-family: var(--f-third); }
</style>
