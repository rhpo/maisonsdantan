<script lang="ts">
	import { fade } from 'svelte/transition';
	import { faCropAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	interface CropInfo {
		x: number;
		y: number;
		aspectRatio?: number;
	}

	interface Props {
		src: string | string[];
		interval?: number;
		adapt?: boolean;
		crop?: CropInfo;
		dimensions?: { width: number; height: number };
		cropMessage?: string;
		onclick?: () => void;
		alt?: string;
	}

	let {
		src,
		interval = 5000,
		adapt = false,
		crop,
		dimensions = { width: 0, height: 0 },
		cropMessage = 'Cliquer pour recadrer',
		onclick,
		alt = ''
	}: Props = $props();

	let currentIndex = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	let srcs = $derived(Array.isArray(src) ? src : [src]);
	let currentSrc = $derived(srcs[currentIndex] ?? '');

	$effect(() => {
		if (srcs.length > 1) {
			timer = setInterval(() => {
				currentIndex = currentIndex === srcs.length - 1 ? 0 : currentIndex + 1;
			}, interval);
		}
		return () => clearInterval(timer);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="main" class:adapt onclick={onclick}>
	{#if crop !== undefined}
		<div class="hover-screen">
			<Fa icon={faCropAlt} />
			<h2>{cropMessage}</h2>
		</div>
	{/if}

	{#each srcs as s, n}
		{#if n === currentIndex}
			<img src={s} {alt} transition:fade={{ duration: 400 }} />
		{/if}
	{/each}

	{#if adapt}
		<img class="holder" src={currentSrc} {alt} />
	{/if}
</div>

<style>
	.hover-screen {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 5rem;
		z-index: 3;
		opacity: 0;
		transition: opacity var(--animation-duration);
		cursor: var(--cursor-pointer);
	}

	.hover-screen h2 {
		font-size: 1rem;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.main:hover .hover-screen {
		opacity: 1;
	}

	.main {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.main img:not(.holder) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all var(--animation-duration);
	}

	.holder {
		z-index: -1;
		width: 100%;
		position: relative;
	}

	.main.adapt {
		height: fit-content;
	}

	@media screen and (max-width: 787px) {
		.hover-screen {
			display: none;
		}
	}
</style>
