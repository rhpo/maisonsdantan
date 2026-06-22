<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/products', label: 'Produits' },
		{ href: '/admin/orders', label: 'Commandes' },
		{ href: '/admin/messages', label: 'Messages' },
		{ href: '/admin/users', label: 'Utilisateurs' },
		{ href: '/admin/logs', label: 'Logs' }
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="admin-shell">
	<aside>
		<div class="brand">ADMIN</div>
		<nav>
			{#each navItems as item}
				<a
					href={item.href}
					class:active={currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href))}
				>
					{item.label}
				</a>
			{/each}
		</nav>
		<form method="POST" action="/admin/login?/logout">
			<button type="submit" class="logout">Déconnexion</button>
		</form>
	</aside>

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(body) { background: #f4f4f4; }

	.admin-shell {
		display: grid;
		grid-template-columns: 220px 1fr;
		min-height: 100vh;
	}

	aside {
		background: var(--secondary);
		color: var(--primary);
		display: flex;
		flex-direction: column;
		padding: 1.5rem 0;
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.brand {
		font-family: var(--f-primary);
		font-size: 1.2rem;
		letter-spacing: 0.3rem;
		padding: 0 1.5rem 1.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.1);
		margin-bottom: 1rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	nav a {
		padding: 0.75rem 1.5rem;
		font-family: var(--f-third);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05rem;
		opacity: 0.6;
		transition: all var(--animation-duration);
		border-left: 3px solid transparent;
	}

	nav a:hover,
	nav a.active {
		opacity: 1;
		background: rgba(255,255,255,0.08);
		border-left-color: white;
	}

	.logout {
		margin: 1rem 1.5rem;
		padding: 0.5rem;
		background: rgba(255,255,255,0.1);
		border: 1px solid rgba(255,255,255,0.2);
		border-radius: var(--radius);
		color: white;
		font-family: var(--f-third);
		font-size: 0.8rem;
		cursor: var(--cursor-pointer);
		transition: all var(--animation-duration);
	}

	.logout:hover { background: rgba(255,255,255,0.2); }

	main {
		padding: 2rem;
		overflow-y: auto;
	}

	@media screen and (max-width: 768px) {
		.admin-shell { grid-template-columns: 1fr; }
		aside { position: static; height: auto; flex-direction: row; flex-wrap: wrap; padding: 1rem; }
		nav { flex-direction: row; flex-wrap: wrap; }
		nav a { padding: 0.4rem 0.75rem; border-left: none; border-bottom: 3px solid transparent; }
		nav a.active { border-left: none; border-bottom-color: white; }
	}
</style>
