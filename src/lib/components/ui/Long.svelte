<script lang="ts">
	interface Props {
		text: string;
		max?: number;
	}

	let { text, max = 120 }: Props = $props();

	let truncated = $derived(text?.length > max ? text.slice(0, max) + '...' : text);
</script>

<span title={text}>{truncated}</span>
