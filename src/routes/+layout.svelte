<script lang="ts">
	import '$lib/app.css';
	import 'aos/dist/aos.css';
	import AOS from 'aos';
	import { page } from '$app/stores';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Menu from '$lib/components/layout/Menu.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let { children, data } = $props();

	let isAdmin = $derived($page.url.pathname.startsWith('/admin'));

	$effect(() => {
		AOS.init();

		function reveal() {
			document.querySelectorAll('body [data-listener]').forEach((el) => {
				const inView = el.getBoundingClientRect().top < window.innerHeight;
				el.classList.toggle('shown', inView);
			});
		}

		document.addEventListener('scroll', reveal);
		reveal();
		return () => document.removeEventListener('scroll', reveal);
	});

	// refresh AOS after each navigation so newly-rendered elements animate
	$effect(() => {
		$page.url.pathname;
		AOS.refresh();
	});

	$effect(() => {
		const stored = localStorage.getItem('cart');
		const storedId = localStorage.getItem('orderId');
		if (stored) {
			try {
				cart.init(JSON.parse(stored), storedId ? parseInt(storedId) : undefined);
			} catch {}
		}
	});

	$effect(() => {
		localStorage.setItem('cart', JSON.stringify(cart.items));
		if (cart.orderId) localStorage.setItem('orderId', String(cart.orderId));
		else localStorage.removeItem('orderId');
	});
</script>

{#if isAdmin}
	{@render children()}
{:else}
	<Menu />
	<NavBar />

	<div class="app">
		{@render children()}
	</div>

	<Footer />
{/if}

<style>
	.app {
		min-height: 100vh;
	}
</style>
