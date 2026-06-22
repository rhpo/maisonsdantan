<script lang="ts">
	import Fa from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	interface Props {
		value?: string;
		placeholder?: string;
		icon?: IconDefinition;
		type?: string;
		transform?: (v: string) => string;
		verify?: (v: string) => boolean;
		name?: string;
		required?: boolean;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		icon,
		type = 'text',
		transform,
		verify,
		name,
		required = false
	}: Props = $props();

	let valid = $derived(!verify || !value || verify(value));

	function handleInput(e: Event) {
		const raw = (e.target as HTMLInputElement).value;
		value = transform ? transform(raw) : raw;
	}
</script>

<div class="ui" class:invalid={!valid && value}>
	{#if icon}
		<span class="icon"><Fa {icon} /></span>
	{/if}
	<input
		{type}
		{placeholder}
		{name}
		{required}
		bind:value
		oninput={handleInput}
	/>
</div>

<style>
	.ui {
		display: flex;
		align-items: center;
		border: 1px solid #ccc;
		border-radius: var(--radius);
		background-color: #f9f9f9;
		overflow: hidden;
		transition: border-color var(--animation-duration);
	}

	.ui:focus-within {
		border-color: var(--secondary);
	}

	.ui.invalid {
		border-color: var(--red);
	}

	.icon {
		padding: 0 0.6rem;
		opacity: 0.5;
		display: flex;
		align-items: center;
	}

	input {
		flex: 1;
		border: none;
		background: transparent;
		padding: 0.5rem;
		font-family: var(--f-third);
		font-size: 0.95rem;
		outline: none;
	}
</style>
