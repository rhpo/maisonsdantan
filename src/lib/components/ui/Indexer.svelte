<script lang="ts">
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	interface Props {
		page: number;
		total: number;
		limit?: number;
	}

	let { page = $bindable(1), total, limit = 25 }: Props = $props();

	let pages = $derived(Math.ceil(total / limit));
	let canPrev = $derived(page > 1);
	let canNext = $derived(page < pages);
</script>

{#if pages > 1}
	<div class="indexer">
		<button disabled={!canPrev} onclick={() => (page -= 1)}>
			<Fa icon={faChevronLeft} />
		</button>
		<span>{page} / {pages}</span>
		<button disabled={!canNext} onclick={() => (page += 1)}>
			<Fa icon={faChevronRight} />
		</button>
	</div>
{/if}

<style>
	.indexer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button {
		background: var(--secondary);
		color: var(--primary);
		border: none;
		border-radius: var(--radius);
		padding: 0.4rem 0.8rem;
		cursor: var(--cursor-pointer);
		transition: opacity var(--animation-duration);
	}

	button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	span {
		font-family: var(--f-third);
		font-size: 0.85rem;
		min-width: 4rem;
		text-align: center;
	}
</style>
