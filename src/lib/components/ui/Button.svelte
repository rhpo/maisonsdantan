<script lang="ts">
	import Fa from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	interface Props {
		title?: string;
		icon?: IconDefinition;
		disabled?: boolean;
		onclick?: () => void;
		url?: string;
		newTab?: boolean;
		color?: string;
		background?: string;
		type?: 'button' | 'submit' | 'reset';
		[key: string]: unknown;
	}

	let {
		title = 'Click',
		icon,
		disabled = false,
		onclick,
		url,
		newTab = true,
		color = 'var(--primary)',
		background = 'var(--secondary)',
		type = 'button',
		...rest
	}: Props = $props();
</script>

{#if url}
	<a href={url} target={newTab ? '_blank' : '_self'}>
		<button style="color: {color}; background-color: {background};" {disabled} {...rest}>
			{#if icon}<Fa {icon} />{/if}
			{title}
		</button>
	</a>
{:else}
	<button
		{onclick}
		{disabled}
		{type}
		class:disabled
		style="color: {color}; background-color: {background};"
		{...rest}
	>
		{#if icon}<Fa {icon} />{/if}
		{title}
	</button>
{/if}

<style>
	a {
		text-decoration: none;
	}

	button {
		border: none;
		border-radius: var(--radius);
		padding: 10px;
		font-size: 1.1rem;
		cursor: var(--cursor-pointer);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		width: 100%;
		transition: all var(--animation-duration);
	}

	button:disabled,
	.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	button:not(:disabled):hover {
		background-color: var(--primary) !important;
		color: var(--secondary) !important;
		transform: scale(1.05);
	}
</style>
