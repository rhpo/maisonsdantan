<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	const site = {
		title: "MAISONS D'ANTAN - Modernité du papier peint mural.",
		description:
			"Découvrez une incroyable variété de modèles de papier peint provenant des éditeurs de renom à travers le monde.",
		url: 'https://maisonsdantan.co',
		name: "MAISONS D'ANTAN"
	};
</script>

<MetaTags
	title={site.title}
	description={site.description}
	canonical={site.url}
	titleTemplate="%s"
	openGraph={{
		title: site.title,
		description: site.description,
		url: site.url,
		siteName: site.name
	}}
/>

<main>
	<section class="hero revert">
		<div class="hero-content">
			<h1>Le papier peint panoramique...<br />L'art du paysage</h1>
			<p class="subtext">Découvrez nos collections</p>
			<a href="/products" class="cta">Explorer la collection</a>
		</div>
	</section>

	<section class="features">
		<div class="feature">
			<h2>Qualité premium</h2>
			<p>Papiers peints haut de gamme, finitions irréprochables.</p>
		</div>
		<div class="feature">
			<h2>Sur mesure</h2>
			<p>Chaque commande dimensionnée à votre espace.</p>
		</div>
		<div class="feature">
			<h2>Livraison partout</h2>
			<p>Livraison sur tout le territoire algérien.</p>
		</div>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}

	.hero {
		width: 100%;
		min-height: 100vh;
		background-image: url('/back.jpg');
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-top: var(--nav-height);
	}

	.hero-content {
		text-align: right;
		color: #fff;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 45rem;
	}

	h1 {
		font-size: 3.5rem;
		font-family: var(--f-primary);
		letter-spacing: 0.35rem;
	}

	.subtext {
		font-size: 1.5rem;
		opacity: 0.7;
		font-family: var(--f-third);
	}

	.cta {
		display: inline-block;
		padding: 0.8rem 2rem;
		background: white;
		color: var(--secondary);
		font-family: var(--f-third);
		font-size: 0.9rem;
		letter-spacing: 0.1rem;
		text-transform: uppercase;
		border-radius: var(--radius);
		transition: all var(--animation-duration);
		align-self: flex-end;
	}

	.cta:hover {
		background: var(--secondary);
		color: white;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		padding: var(--margin);
		gap: var(--gap);
		background: var(--sub);
	}

	.feature {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.feature h2 {
		font-family: var(--f-primary);
		font-size: 1.5rem;
	}

	.feature p {
		font-family: var(--f-third);
		font-size: 0.9rem;
		opacity: 0.7;
	}

	@media screen and (max-width: 820px) {
		.hero-content {
			text-align: center;
			align-items: center;
		}

		h1 { font-size: 2rem; }
		.subtext { font-size: 1rem; }
	}
</style>
