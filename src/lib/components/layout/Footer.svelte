<script lang="ts">
	import Container from '$lib/components/Container.svelte';
</script>

<footer>
	<Container>
		<div class="content">
			<div class="brand">
				<p class="name">MAISONS D'ANTAN</p>
				<p class="tagline">Modernité du papier peint mural.</p>
			</div>

			<div class="links">
				<div class="col">
					<h4>Navigation</h4>
					<a href="/products">Collection</a>
					<a href="/guide/catalogue">Catalogue</a>
					<a href="/professionels">Professionnels</a>
					<a href="/contact">Contact</a>
				</div>
				<div class="col">
					<h4>Guide</h4>
					<a href="/guide/catalogue">Catalogue</a>
					<a href="/guide/fiche-technique">Fiche technique</a>
					<a href="/guide/notice-de-pose">Notice de pose</a>
				</div>
			</div>
		</div>

		<div class="bottom">
			<p>© {new Date().getFullYear()} Maisons d'Antan. Tous droits réservés.</p>
		</div>
	</Container>
</footer>

<style>
	footer {
		background-color: var(--secondary);
		color: var(--primary);
		padding: 4rem 0 2rem;
	}

	.content {
		display: flex;
		justify-content: space-between;
		gap: 3rem;
		flex-wrap: wrap;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.name {
		font-family: var(--f-primary);
		font-size: 1.5rem;
		letter-spacing: 0.2rem;
	}

	.tagline {
		font-family: var(--f-third);
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.links {
		display: flex;
		gap: 3rem;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	h4 {
		font-family: var(--f-third);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		opacity: 0.4;
		margin-bottom: 0.25rem;
	}

	a {
		font-family: var(--f-third);
		font-size: 0.9rem;
		opacity: 0.7;
		transition: opacity var(--animation-duration);
	}

	a:hover {
		opacity: 1;
	}

	.bottom {
		padding-top: 1.5rem;
		text-align: center;
	}

	.bottom p {
		font-family: var(--f-third);
		font-size: 0.8rem;
		opacity: 0.4;
	}
</style>
