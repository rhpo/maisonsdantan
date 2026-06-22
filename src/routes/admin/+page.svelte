<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { stats, recentOrders } = data;
</script>

<div class="dashboard">
	<h1>Tableau de bord</h1>

	<div class="stats-grid">
		<div class="stat">
			<span class="val">{stats.totalProducts}</span>
			<span class="label">Produits</span>
		</div>
		<div class="stat">
			<span class="val">{stats.totalOrders}</span>
			<span class="label">Commandes totales</span>
		</div>
		<div class="stat" class:alert={stats.pendingOrders > 0}>
			<span class="val">{stats.pendingOrders}</span>
			<span class="label">En attente</span>
		</div>
		<div class="stat" class:alert={stats.unreadOrders > 0}>
			<span class="val">{stats.unreadOrders}</span>
			<span class="label">Non lues</span>
		</div>
		<div class="stat" class:alert={stats.unreadMessages > 0}>
			<span class="val">{stats.unreadMessages}</span>
			<span class="label">Messages non lus</span>
		</div>
	</div>

	<section>
		<h2>Commandes récentes</h2>
		{#if recentOrders.length === 0}
			<p class="empty">Aucune commande.</p>
		{:else}
			<table>
				<thead>
					<tr><th>#</th><th>Client</th><th>Date</th><th>Statut</th><th></th></tr>
				</thead>
				<tbody>
					{#each recentOrders as order}
						<tr class:unread={!order.read}>
							<td>{order.id}</td>
							<td>{order.info?.name ?? '—'}</td>
							<td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
							<td>
								<span class="badge" class:pending={order.pending} class:done={!order.pending}>
									{order.pending ? 'En attente' : 'Complétée'}
								</span>
							</td>
							<td><a href="/admin/orders">Voir</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>

<style>
	h1 {
		font-family: var(--f-primary);
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	h2 {
		font-family: var(--f-primary);
		font-size: 1.3rem;
		margin-bottom: 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	.stat.alert { border-left: 4px solid #e74c3c; }

	.val {
		font-size: 2rem;
		font-family: var(--f-primary);
		line-height: 1;
	}

	.label {
		font-family: var(--f-third);
		font-size: 0.75rem;
		text-transform: uppercase;
		opacity: 0.5;
	}

	section {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--f-third);
		font-size: 0.85rem;
	}

	th {
		text-align: left;
		padding: 0.5rem;
		opacity: 0.5;
		border-bottom: 1px solid #eee;
		font-weight: 500;
	}

	td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #f5f5f5; }
	tr.unread td { font-weight: 600; }

	.badge {
		padding: 0.2rem 0.6rem;
		border-radius: 20px;
		font-size: 0.75rem;
	}

	.badge.pending { background: #fff3cd; color: #856404; }
	.badge.done { background: #d1e7dd; color: #0f5132; }

	a { color: var(--secondary); text-decoration: underline; }
	.empty { opacity: 0.5; font-family: var(--f-third); font-size: 0.9rem; }
</style>
