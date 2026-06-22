<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let authorized = $derived(data.users.filter((u) => u.status === 'authorized'));
	let pending = $derived(data.users.filter((u) => u.status === 'pending'));
</script>

<div class="page">
	<h1>Utilisateurs</h1>

	{#if pending.length > 0}
		<section>
			<h2>En attente ({pending.length})</h2>
			<div class="list">
				{#each pending as user}
					<div class="user pending-user">
						{#if user.photo_url}<img src={user.photo_url} alt={user.display_name} class="avatar" />{/if}
						<div class="info">
							<strong>{user.display_name}</strong>
							<span>{user.email}</span>
						</div>
						<div class="actions">
							<form method="POST" action="?/authorize" use:enhance>
								<input type="hidden" name="userId" value={user.id} />
								<input type="hidden" name="name" value={user.display_name} />
								<button type="submit" class="btn-primary">Autoriser</button>
							</form>
							<form method="POST" action="?/revoke" use:enhance>
								<input type="hidden" name="userId" value={user.id} />
								<input type="hidden" name="name" value={user.display_name} />
								<button type="submit" class="btn-danger">Refuser</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<section>
		<h2>Autorisés ({authorized.length})</h2>
		<div class="list">
			{#each authorized as user}
				<div class="user">
					{#if user.photo_url}<img src={user.photo_url} alt={user.display_name} class="avatar" />{/if}
					<div class="info">
						<strong>{user.display_name}</strong>
						<span>{user.email}</span>
					</div>
					<div class="actions">
						<form method="POST" action="?/revoke" use:enhance>
							<input type="hidden" name="userId" value={user.id} />
							<input type="hidden" name="name" value={user.display_name} />
							<button type="submit" class="btn-danger">Révoquer</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	h1 { font-family: var(--f-primary); font-size: 1.8rem; margin-bottom: 1.5rem; }
	h2 { font-family: var(--f-primary); font-size: 1.2rem; margin-bottom: 1rem; }
	section { margin-bottom: 2rem; }

	.list { display: flex; flex-direction: column; gap: 0.75rem; }

	.user {
		background: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.pending-user { border-left: 4px solid #f59e0b; }

	.avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

	.info { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
	.info strong { font-family: var(--f-third); font-size: 0.95rem; }
	.info span { font-family: var(--f-third); font-size: 0.8rem; opacity: 0.5; }

	.actions { display: flex; gap: 0.5rem; }

	.btn-primary, .btn-danger {
		padding: 0.35rem 0.75rem;
		border: none;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.8rem;
		cursor: var(--cursor-pointer);
		white-space: nowrap;
	}
	.btn-primary { background: var(--secondary); color: white; }
	.btn-danger { background: #fee2e2; color: #991b1b; }
</style>
