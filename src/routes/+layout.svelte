<script lang="ts">
	import '$lib/app.css';
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Menu from '$lib/components/layout/Menu.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let { children, data } = $props();

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

<Menu />
<NavBar />

<div class="app">
	{@render children()}
</div>

<Footer />

<style>
	.app {
		min-height: 100vh;
	}
</style>
