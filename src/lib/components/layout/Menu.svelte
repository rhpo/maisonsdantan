<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ui } from '$lib/stores/ui.svelte';
	import { cart } from '$lib/stores/cart.svelte';
</script>

{#if ui.menuOpen}
	<div class="overlay" transition:slide={{ axis: 'y', duration: 250 }}>
		<nav>
			<ul>
				<li><a href="/products" onclick={() => ui.closeMenu()}>Collection</a></li>
				<li><a href="/guide/catalogue" onclick={() => ui.closeMenu()}>Catalogue</a></li>
				<li><a href="/professionels" onclick={() => ui.closeMenu()}>Professionnels</a></li>
				<li><a href="/contact" onclick={() => ui.closeMenu()}>Contact</a></li>
				<li>
					<a href="/panier" onclick={() => ui.closeMenu()}>
						Panier{cart.count > 0 ? ` (${cart.count})` : ''}
					</a>
				</li>
			</ul>
		</nav>

		<button class="close" onclick={() => ui.closeMenu()} aria-label="Fermer">✕</button>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 999;
		background-color: rgba(255, 255, 255, 0.97);
		backdrop-filter: blur(8px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		text-align: center;
	}

	nav a {
		font-family: var(--f-primary);
		font-size: 2rem;
		letter-spacing: 0.2rem;
		color: var(--secondary);
		text-transform: uppercase;
		transition: opacity var(--animation-duration);
	}

	nav a:hover {
		opacity: 0.5;
	}

	.close {
		position: absolute;
		top: 2rem;
		right: 2rem;
		background: none;
		border: none;
		font-size: 2rem;
		cursor: var(--cursor-pointer);
		color: var(--secondary);
	}
</style>
