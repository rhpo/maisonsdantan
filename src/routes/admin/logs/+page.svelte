<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="page">
	<h1>Logs ({data.logs.length})</h1>

	{#if data.logs.length === 0}
		<p class="empty">Aucun log.</p>
	{:else}
		<div class="log-list">
			{#each data.logs as log}
				<div class="log">
					<span class="time">{new Date(log.created_at).toLocaleString('fr-FR')}</span>
					<span class="user">{log.user_name || 'Système'}</span>
					<span class="action">{log.action}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	h1 { font-family: var(--f-primary); font-size: 1.8rem; margin-bottom: 1.5rem; }

	.log-list {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	.log {
		display: grid;
		grid-template-columns: 180px 140px 1fr;
		gap: 1rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid #f5f5f5;
		font-family: var(--f-third);
		font-size: 0.8rem;
		align-items: center;
	}

	.log:last-child { border-bottom: none; }
	.log:hover { background: var(--sub); }

	.time { opacity: 0.4; }
	.user { font-weight: 600; opacity: 0.7; }
	.action { opacity: 0.8; }

	.empty { opacity: 0.5; font-family: var(--f-third); }
</style>
