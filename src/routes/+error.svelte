<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error">
	<h1>{$page.status}</h1>
	<p>{$page.error?.message ?? 'Une erreur est survenue.'}</p>
	<a href="/">Retour à l'accueil</a>
</div>

<style>
	.error {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		text-align: center;
		padding: 2rem;
	}

	h1 {
		font-size: 6rem;
		font-family: var(--f-primary);
		opacity: 0.2;
	}

	p {
		font-family: var(--f-third);
		opacity: 0.6;
	}

	a {
		padding: 0.6rem 1.5rem;
		background: var(--secondary);
		color: var(--primary);
		font-family: var(--f-third);
		border-radius: var(--radius);
		font-size: 0.9rem;
	}
</style>
