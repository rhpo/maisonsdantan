<script lang="ts">
	import Container from './Container.svelte';

	interface Props {
		title?: string;
		description?: string;
		centered?: boolean;
		centerX?: boolean;
		children: import('svelte').Snippet;
	}

	let { title, description, centered = false, centerX = false, children }: Props = $props();
</script>

<section class:centered class:centerX>
	<Container>
		{#if title || description}
			<div class="header">
				{#if title}<h1>{title}</h1>{/if}
				{#if description}<p>{description}</p>{/if}
			</div>
		{/if}
		<div class="content">
			{@render children()}
		</div>
	</Container>
</section>

<style>
	section {
		width: 100%;
		padding-top: var(--page-padding);
		padding-bottom: var(--gap);
		min-height: 100vh;
	}

	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.centerX .content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.header {
		margin-bottom: var(--gap);
	}

	h1 {
		font-family: var(--f-primary);
		font-size: var(--heading-size);
		margin-bottom: 0.5rem;
	}

	p {
		font-family: var(--f-second);
		font-size: var(--paragraph-size);
		opacity: 0.6;
	}
</style>
