<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="page">
	<h1>Messages ({data.messages.length})</h1>

	{#if data.messages.length === 0}
		<p class="empty">Aucun message.</p>
	{:else}
		<div class="list">
			{#each data.messages as msg}
				<div class="msg" class:unread={!msg.read}>
					<div class="msg-header">
						<div>
							<strong>{msg.name}</strong>
							<a href="mailto:{msg.email}">{msg.email}</a>
							{#if msg.phone}<span class="phone">{msg.phone}</span>{/if}
						</div>
						<span class="date">{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
					</div>
					<p class="body">{msg.message}</p>
					<div class="actions">
						{#if !msg.read}
							<form method="POST" action="?/markRead" use:enhance>
								<input type="hidden" name="id" value={msg.id} />
								<button type="submit" class="btn-secondary">Marquer lu</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={msg.id} />
							<button type="submit" class="btn-danger">Supprimer</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 { font-family: var(--f-primary); font-size: 1.8rem; margin-bottom: 1.5rem; }
	.list { display: flex; flex-direction: column; gap: 1rem; }

	.msg {
		background: white;
		border-radius: 8px;
		padding: 1.25rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
		border-left: 4px solid transparent;
	}
	.msg.unread { border-left-color: #3b82f6; }

	.msg-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.msg-header > div { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }

	.msg-header strong { font-family: var(--f-third); }
	.msg-header a { font-family: var(--f-third); font-size: 0.85rem; opacity: 0.7; text-decoration: underline; }
	.phone { font-family: var(--f-third); font-size: 0.85rem; opacity: 0.6; }
	.date { font-family: var(--f-third); font-size: 0.8rem; opacity: 0.4; white-space: nowrap; }

	.body { font-family: var(--f-second); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem; }

	.actions { display: flex; gap: 0.5rem; justify-content: flex-end; }

	.btn-secondary, .btn-danger {
		padding: 0.3rem 0.75rem;
		border: none;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.8rem;
		cursor: var(--cursor-pointer);
	}
	.btn-secondary { background: var(--sub); border: 1px solid #ddd; }
	.btn-danger { background: #fee2e2; color: #991b1b; }

	.empty { opacity: 0.5; font-family: var(--f-third); }
</style>
