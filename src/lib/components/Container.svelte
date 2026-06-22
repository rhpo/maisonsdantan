<script lang="ts">
	let { children } = $props();
</script>

<div class="container">
	{@render children()}
</div>

<style>
	.container {
		width: 100%;
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 var(--margin);
	}

	@media screen and (max-width: 810px) {
		.container {
			padding: 0 1.5rem;
		}
	}
</style>
