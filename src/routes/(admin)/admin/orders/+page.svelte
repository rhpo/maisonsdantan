<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import { faArchive, faBell, faCheck, faEye, faImage } from '@fortawesome/free-solid-svg-icons';
	import Loading from '$lib/components/admin/Loading.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	const track = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	const prices: Record<string, number> = { poster: 2000, rouleau: 2600 };

	function calculatePrice(item: { width: number; height: number; material: string }) {
		const price = prices[item.material] ?? 0;
		return (price * item.width * item.height) / 100 ** 2;
	}

	function since(date: string) {
		const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
		const units: [number, string][] = [
			[60, 'seconde'],
			[60, 'minute'],
			[24, 'heure'],
			[30, 'jour'],
			[12, 'mois'],
			[Infinity, 'an']
		];
		let value = diff;
		let i = 0;
		for (; i < units.length - 1 && value >= units[i][0]; i++) value = Math.floor(value / units[i][0]);
		const label = units[i][1];
		return `il y a ${value} ${label}${value > 1 && label !== 'mois' ? 's' : ''}`;
	}

	let sec = $state(0);
	$effect(() => {
		const t = setInterval(() => sec++, 1000);
		return () => clearInterval(t);
	});
</script>

<Loading show={submitting} />

{#if data.orders.length === 0}
	<h3>Pas de commandes pour le moment...</h3>
{:else}
	<div class="orders">
		{#each data.orders as order, i}
			<div class="product-wrapper">
				<div class="order-details">
					<h3 class="details">
						<p>
							<strong style="margin-left: 0 !important">{i + 1}.</strong>
							<span style="opacity: 0.4">#{order.id}</span>
							{#if order.read}
								<Fa icon={faEye} />
							{:else}
								<p style="color: red"><Fa icon={faBell} /></p>
							{/if}
						</p>
						<p class="total">
							{order.cart.reduce((acc, item) => acc + calculatePrice(item), 0)} DA
						</p>
					</h3>

					<div class="since">
						<span>
							{order.info.name}
							&bull; <b>{order.info.phone.replace('+213', '0')}</b>
							&bull; {order.info.email}
							&bull; {order.info.address}
						</span>
						<span>
							{#key sec}
								{since(order.created_at)}
							{/key}
						</span>
					</div>
				</div>

				<div class="order">
					<div class="cart">
						{#each order.cart as item}
							<div class="product">
								<div class="text">
									<div class="branding">
										<h4 class="name">{item.product?.name ?? `#${item.id}`}</h4>

										<p>
											Variant: {item.model}
											{#if item.variant}({item.variant.name}){/if}
										</p>

										<p class="location">
											<Fa icon={faArchive} />
											{item.id}.zip &gt; {item.model}
											<Fa icon={faImage} /> image.jpg
										</p>
									</div>

									<div class="info">
										<p>Matériel <strong>{item.material}</strong></p>
										<p>Forme <strong>{item.product?.shape ?? '—'}</strong></p>
										<p>
											Hauteur <strong>({item.height}cm) &bull; Largeur ({item.width}cm)</strong>
										</p>
										<p>
											Prix <strong>
												{item.width / 100}m &times; {item.height / 100}m &times; {prices[item.material]}da
												= {(((item.width / 100) * item.height) / 100 * prices[item.material]).toFixed(0)}da
											</strong>
										</p>

										{#if item.product?.shape !== 'pattern' && item.crop}
											<br />
											<p>
												Recadrage <strong>
													Haut ({item.crop.y?.toFixed(2)}) &bull; Gauche ({item.crop.x?.toFixed(2)})
												</strong>
											</p>
										{/if}
									</div>
								</div>

								<div class="visual">
									{#if item.variant?.image}
										<img src={item.variant.image} alt="product" />
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<div class="actions">
						{#if order.pending}
							<form method="POST" action="?/complete" use:enhance={track}>
								<input type="hidden" name="id" value={order.id} />
								<button type="submit" class="complete">
									<Fa icon={faCheck} /> Marquer comme traitée
								</button>
							</form>
						{/if}
						<form method="POST" action="?/delete" use:enhance={track}>
							<input type="hidden" name="id" value={order.id} />
							<button type="submit" class="delete">Supprimer</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

	strong {
		margin-left: 16px !important;
		font-weight: 600;
	}

	.since {
		display: flex;
		justify-content: space-between;
	}

	b {
		font-weight: 600;
		text-decoration: underline;
	}

	.since span {
		font-family: 'Montserrat', sans-serif !important;
	}

	.orders {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.order,
	.order * {
		font-family: 'Montserrat', sans-serif !important;
		text-transform: uppercase;
	}

	.branding {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.branding .location {
		font-size: 0.8rem;
		text-transform: lowercase;
	}

	.branding .name {
		font-size: 2rem;
		text-transform: uppercase;
		font-weight: 200;
	}

	.cart {
		display: flex;
		flex-direction: column;
	}

	.order {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		margin-left: 1rem !important;
		border-left: 5px solid black;
		background-color: rgb(247, 247, 247);
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.details {
		text-transform: uppercase;
		font-weight: 200;
		font-family: 'Montserrat', sans-serif !important;
		font-size: 3rem !important;

		display: flex;
		justify-content: space-between;
	}

	.details * {
		text-transform: uppercase;
		font-weight: 200;
		font-family: 'Montserrat', sans-serif !important;
		font-size: 3rem !important;
	}

	.total {
		color: green;
	}

	.product-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.product-wrapper * {
		margin: 0;
	}

	.product {
		border-bottom: 2px dashed rgb(206, 206, 206);
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 1rem;
	}

	.actions {
		padding: 0 1rem 0.5rem;
		display: flex;
		gap: 0.5rem;
	}

	.product * {
		margin: 0;
	}

	.visual {
		aspect-ratio: 1;
		height: 150px;
	}

	.visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.complete,
	.delete {
		border: none;
		border-radius: var(--radius);
		padding: 10px 16px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s;
	}

	.complete {
		background: green;
		color: white;
	}

	.delete {
		background: #fee2e2;
		color: #991b1b;
	}

	.complete:hover,
	.delete:hover {
		transform: scale(1.03);
	}
</style>
