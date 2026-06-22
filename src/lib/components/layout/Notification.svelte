<script lang="ts">
	import { slide } from 'svelte/transition';
	import { faX } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Container from '$lib/components/Container.svelte';
	import { notification } from '$lib/stores/notification.svelte';

	$effect(() => {
		document.documentElement.style.setProperty(
			'--notification-height',
			notification.state.show ? '3.75rem' : '0rem'
		);
	});
</script>

{#if notification.state.show}
	<div
		class="notification"
		style="background-color: {notification.state.colors.background}; color: {notification.state.colors.text};"
		transition:slide
	>
		<Container>
			<div class="wrapper">
				<span></span>
				<div class="info">
					<Fa icon={notification.state.icon} />
					<p>{notification.state.message}</p>
				</div>
				<button onclick={() => notification.hide()} class="close">
					<Fa icon={faX} />
				</button>
			</div>
		</Container>
	</div>
{/if}

<style>
	.notification {
		display: flex;
		justify-content: center;
		align-items: center;
		height: var(--notification-height);
		overflow: hidden;
		transition: height var(--animation-duration);
	}

	.wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.info p {
		font-family: var(--f-third);
		font-size: 0.9rem;
	}

	.close {
		background: transparent;
		border: none;
		cursor: var(--cursor-pointer);
		opacity: 0.7;
	}

	.close:hover {
		opacity: 1;
	}
</style>
