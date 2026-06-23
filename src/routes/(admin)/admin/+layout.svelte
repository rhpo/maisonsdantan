<script lang="ts">
	import { page } from '$app/stores';
	import { faSignOut } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Tableau de bord 📊' },
		{ href: '/admin/orders', label: 'Commandes 📦' },
		{ href: '/admin/products', label: 'Papiers Peints 🖼️' },
		{ href: '/admin/messages', label: 'Mailbox 📩' },
		{ href: '/admin/logs', label: 'Journal 📰' },
		{ href: '/admin/users', label: 'Administrateurs 👥' }
	];

	let currentPath = $derived($page.url.pathname);

	function isActive(href: string) {
		return href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(href);
	}

	let currentLabel = $derived(
		navItems.find((i) => isActive(i.href))?.label ?? 'Administration'
	);
</script>

<div class="screen">
	<div class="page">
		<main>
			<nav>
				<div class="left">
					<img src="/logo.svg" class="invert" alt="MAISONS D'ANTAN Logo" />
					<h1>Administration - {currentLabel}</h1>
				</div>

				<div class="right">
					<form method="POST" action="/admin/login?/logout">
						<button type="submit" class="logout">
							<Fa icon={faSignOut} /> Déconnexion
						</button>
					</form>
				</div>
			</nav>

			<section>
				<div class="inner">
					<div class="tabs">
						{#each navItems as item}
							<a
								href={item.href}
								class="tab"
								class:active={isActive(item.href)}
							>
								{item.label}
							</a>
						{/each}
					</div>

					<div class="content">
						{@render children()}
					</div>
				</div>
			</section>
		</main>
	</div>
</div>

<div class="not-supported">
	<h1>Veuillez utiliser un appareil plus grand pour accéder à l'administration.</h1>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
		background: white;
	}

	.not-supported {
		display: none;
	}

	.page {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background-color: white;
		color: black;

		display: flex;
		justify-content: center;
	}

	main {
		width: 100%;
		height: 100vh;
		max-width: 1440px;

		padding: 15px;

		display: flex;
		flex-direction: column;
	}

	nav {
		flex-shrink: 0;
		width: 100%;
		height: 100px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 10px;
		z-index: 10;

		border-bottom: 1px dashed rgb(194, 194, 194);
		border-radius: 0 0 25px 25px;
	}

	.left {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		height: 100%;
	}

	.left img {
		margin: 20px;
		margin-right: 30px;
		height: 100%;
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.right {
		display: flex;
		align-items: center;
	}

	.logout {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid rgb(221, 221, 221);
		background-color: white;
		color: black;
		border-radius: 20px;
		padding: 10px 18px;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		transition: all 0.2s ease-in-out;
	}

	.logout:hover {
		background-color: rgb(243, 243, 243);
		transform: scale(1.05);
	}

	.logout:active {
		transform: scale(0.95);
	}

	section {
		width: 100%;
		flex: 1;
		min-height: 0;
		padding: 20px 0;
		display: flex;
	}

	.inner {
		width: 100%;
		height: 100%;
		padding: 15px;

		background-color: rgb(245, 245, 245);
		border: 1px solid rgb(221, 221, 221);
		border-radius: 35px;
		overflow: hidden;
		display: flex;
	}

	.tabs {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		width: 250px;
		padding: 15px;
		gap: 20px;
		overflow-y: auto;
	}

	.tab {
		display: block;
		text-decoration: none;
		text-align: center;

		background: white;
		color: black;
		border: 1px solid rgb(221, 221, 221);

		padding: 15px;
		border-radius: 8px;
		font-weight: 600;

		transition: all 0.2s;
	}

	.tab:hover {
		transform: scale(1.05);
	}

	.tab.active {
		background: black;
		color: white;
	}

	.content {
		background-color: white;
		width: 100%;
		height: 100%;
		overflow-y: auto;

		border-radius: 35px;
		box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);

		position: relative;
		border-left: 1px solid rgb(221, 221, 221);

		padding: 20px;
	}

	@media screen and (max-width: 600px) {
		.screen {
			display: none;
		}

		.not-supported {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 15px;
			align-items: center;
			width: 100%;
			height: 100vh;
			background-color: white;
			color: black;
			text-align: center;
		}
	}
</style>
