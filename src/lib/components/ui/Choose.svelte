<script lang="ts">
	interface Props {
		choices: Record<string, string>;
		choice: string;
		name?: string;
	}

	let { choices, choice = $bindable(''), name = '' }: Props = $props();
</script>

<div class="ui">
	<select bind:value={choice}>
		{#each Object.entries(choices) as [key, label]}
			<option value={key}>{name && key === Object.keys(choices)[0] ? name + ' ' + label : label}</option>
		{/each}
	</select>
</div>

<style>
	.ui {
		display: flex;
		flex-direction: column;
	}

	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
		background-color: #f9f9f9;
		font-family: var(--f-third);
		text-transform: uppercase;
		font-size: 0.85rem;
		cursor: var(--cursor-pointer);
		outline: none;
	}

	select:focus {
		border-color: var(--secondary);
	}

	select:hover {
		border-color: #666;
	}
</style>
