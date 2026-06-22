<script lang="ts">
	import { enhance } from '$app/forms';
	import Page from '$lib/components/Page.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Image from '$lib/components/Image.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { appConfig } from '$lib/stores/config.svelte';
	import {
		faShoppingBag,
		faTrashCan,
		faSadCry,
		faClockFour,
		faPhone,
		faUser,
		faEnvelope,
		faMapMarkerAlt
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { scale } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const materials = { poster: 'Poster', rouleau: 'En rouleau' };

	let finalizing = $state(false);
	let info = $state({ name: '', phone: '', email: '', address: '' });
	let submitting = $state(false);
	let orderDetails = $state<string[]>([]);
	let completedOrderId = $state<number | undefined>(undefined);

	$effect(() => {
		if (form?.success && form.orderId) {
			cart.setOrderId(form.orderId);
			completedOrderId = form.orderId;
			orderDetails = form.details ?? [];
		}
	});

	let total = $derived(
		cart.items.reduce(
			(acc, item) => acc + appConfig.calculatePrice(item.width, item.height, item.material),
			0
		)
	);

	function phoneFormat(phone: string): string {
		return phone
			.replace(/\D/g, '')
			.replace(/^213/, '')
			.replace(/^0/, '');
	}
</script>

<Page centerX>
	<main>
		{#if completedOrderId || cart.orderId}
			<div class="empty" transition:scale>
				<Fa icon={faClockFour} />
				<h2>Commande envoyée !</h2>
				<p>
					Nous vous appellerons dans les plus brefs délais.<br />
					Numéro de commande : <code>{completedOrderId ?? cart.orderId}</code>
				</p>
				{#if orderDetails.length}
					<ul class="details-list">
						{#each orderDetails as d}<li>{d}</li>{/each}
					</ul>
				{/if}
				<Button url="/products" newTab={false} title="Continuer le shopping" icon={faShoppingBag} />
			</div>
		{:else if cart.items.length === 0}
			<div class="empty">
				<Fa icon={faSadCry} />
				<h2>Votre panier est vide</h2>
				<Button url="/products" newTab={false} title="Faire du shopping" icon={faShoppingBag} />
			</div>
		{:else}
			<h2 class="count">{cart.items.length} article{cart.items.length > 1 ? 's' : ''}</h2>

			{#each [...cart.items].reverse() as item (item.uuid)}
				<div class="order" transition:scale>
					<div class="order-info">
						<div class="order-left">
							<h3>{item.product?.name ?? 'Produit'}</h3>
							<p class="small">{materials[item.material]} — {item.width} × {item.height} cm</p>
						</div>
						<div class="order-right">
							<span class="price">{appConfig.formatPrice(appConfig.calculatePrice(item.width, item.height, item.material))}</span>
							<button onclick={() => cart.remove(item.uuid)} class="remove-btn">
								<Fa icon={faTrashCan} />
							</button>
						</div>
					</div>
					<div class="order-img">
						<Image
							src={item.product?.models?.find((m) => m.id === item.model)?.shootings?.map((s) => s.image) ?? []}
						/>
					</div>
				</div>
			{/each}

			{#if finalizing}
				<div class="form-wrap" transition:scale>
					<h3>Encore une étape 🎉</h3>
					<form
						method="POST"
						action="?/order"
						use:enhance={() => {
							submitting = true;
							return async ({ update }) => {
								submitting = false;
								await update();
							};
						}}
					>
						<input type="hidden" name="cart" value={JSON.stringify(cart.items.map(({ uuid, product, ...i }) => i))} />
						<Input placeholder="Nom & Prénom" icon={faUser} name="name" bind:value={info.name} required />
						<Input placeholder="Téléphone" icon={faPhone} name="phone" type="tel" bind:value={info.phone} required />
						<Input placeholder="Email" icon={faEnvelope} name="email" type="email" bind:value={info.email} required />
						<Input placeholder="Adresse de livraison" icon={faMapMarkerAlt} name="address" bind:value={info.address} required />
						{#if form?.error}<p class="error">{form.error}</p>{/if}
						<Button title={submitting ? '...' : 'Confirmer 🥳'} type="submit" disabled={submitting} />
					</form>
				</div>
			{/if}

			<div class="total">
				<span>Total : {appConfig.formatPrice(total)}</span>
			</div>

			<Button
				title={finalizing ? 'Remplir les informations ci-dessus' : 'Finaliser la commande'}
				onclick={() => (finalizing = true)}
			/>
		{/if}
	</main>
</Page>

<style>
	main {
		width: 100%;
		max-width: var(--inner-maxw);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.empty {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		font-size: 3rem;
		text-align: center;
	}

	.empty h2 { font-size: 1.5rem; }
	.empty p { font-size: 1rem; font-family: var(--f-third); opacity: 0.7; }
	.empty code {
		font-family: monospace;
		background: var(--sub);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.details-list {
		font-size: 0.85rem;
		font-family: var(--f-third);
		text-align: left;
		opacity: 0.7;
	}

	.count {
		font-family: var(--f-primary);
		font-size: 1.3rem;
	}

	.order {
		background: var(--sub);
		border-radius: var(--radius);
		overflow: hidden;
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	.order-info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.order-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.order-left h3 {
		font-family: var(--f-primary);
		font-size: 1rem;
		text-transform: uppercase;
	}

	.order-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.price {
		font-size: 1.3rem;
		font-family: var(--f-third);
		font-weight: bold;
		color: rgb(3, 130, 0);
		white-space: nowrap;
	}

	.remove-btn {
		background: none;
		border: none;
		cursor: var(--cursor-pointer);
		opacity: 0.5;
		transition: opacity var(--animation-duration);
	}

	.remove-btn:hover { opacity: 1; }

	.order-img {
		width: 8rem;
		height: 8rem;
		border-radius: var(--radius);
		overflow: hidden;
		flex-shrink: 0;
	}

	.small { font-size: 0.8rem; opacity: 0.6; font-family: var(--f-third); }

	.form-wrap {
		background: var(--sub);
		padding: 2rem;
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-wrap h3 {
		font-family: var(--f-primary);
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.total {
		font-size: 1.5rem;
		font-family: var(--f-primary);
		text-align: right;
	}

	.error {
		color: var(--red);
		font-family: var(--f-third);
		font-size: 0.9rem;
	}

	@media screen and (max-width: 600px) {
		.order { flex-direction: column-reverse; }
		.order-img { width: 100%; height: 200px; }
		.order-info { flex-direction: column; gap: 0.5rem; }
		.order-right { flex-direction: row; width: 100%; justify-content: space-between; }
	}
</style>
