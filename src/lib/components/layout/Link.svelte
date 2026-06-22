<script lang="ts">
	import Fa from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	interface Props {
		url: string;
		name: string;
		icon: string | IconDefinition;
		description?: string;
		external?: boolean;
		inline?: boolean;
	}

	let { url, name, icon, description, external = false, inline = false }: Props = $props();

	let isObject = $derived(typeof icon === 'object');
</script>

<a
	class="link"
	class:inline
	href={url}
	target={external ? '_blank' : '_self'}
	title={description}
>
	<div class="image revert">
		{#if isObject}
			<span class="revert"><Fa icon={icon as IconDefinition} /></span>
		{:else}
			<img src={icon as string} alt={name} />
		{/if}
	</div>
	<p>{name.toUpperCase()}</p>
</a>

<style>
	.link {
		text-align: center;
		border: 1px dashed transparent;
		transition: all var(--animation-duration);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		height: 100%;
		padding: 1rem 0;
	}

	.link.inline {
		flex-direction: row;
		gap: 1rem;
		height: fit-content;
		width: fit-content;
		padding: 0;
	}

	.link:not(.inline):hover {
		border: 1px dashed var(--secondary);
	}

	.image {
		overflow: hidden;
		width: 100%;
		max-height: calc(var(--header-height) * var(--nav-scalar));
		transition: all var(--animation-duration);
	}

	:global(header.shrunk) .image {
		max-height: 0;
	}

	:global(header.shrunk) .link {
		gap: 0;
	}

	.link:not(.inline):hover .image {
		transform: scale(1.1) translateY(-5px);
	}

	.link img {
		max-height: 3rem;
	}

	p {
		font-weight: 300;
		letter-spacing: 1px;
		font-family: var(--f-third) !important;
		font-size: 0.8rem;
	}
</style>
