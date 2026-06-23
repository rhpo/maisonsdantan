<script lang="ts">
  import Maisons from './Second.svelte';
  import Dantan from './First.svelte';

  let { animate = true }: { animate?: boolean } = $props();
</script>

<a class="logo" href="/" data-aos="flip-left">
  <div class="wrapper" class:animate>
    <div class="part">
      <Maisons />
    </div>

    <div class="part">
      <Dantan />
    </div>
  </div>
</a>

<style>
  *,
  :global(.logo *) {
    transition: all var(--animation-duration) ease;
  }

  .logo {
    cursor: var(--cursor-pointer);
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;
    width: 100%;

    transition: all var(--animation-duration);

    filter: blur(50px);
    transform: perspective(2500px) rotateY(-120deg);
    animation: flip-left 4s ease-in-out forwards;
  }

  :global(.logo.shrunk) {
    scale: var(--nav-scalar);
  }

  .wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--logo-gap);
  }

  .part {
    width: 100%;
    height: calc(50% - var(--logo-gap) / 2);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  :global(.animate .part path) {
    stroke-width: var(--stroke-w);
    stroke-width: 5px;
    stroke-dasharray: 1500;
    stroke-dashoffset: 1500;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: rgba(62, 62, 62, 0);
    stroke: #3e3e3e;

    transform-origin: center center;

    animation: logo-animation 7s cubic-bezier(0.34, 0, 0.62, 0.15) forwards;
  }

  :global(.logo:hover *) {
    stroke-width: var(--stroke-w) !important;
    fill: transparent !important;
  }

  :global(.part svg) {
    width: 100%;
    height: 100%;
  }

  @keyframes logo-animation {
    0% {
      stroke-opacity: 0.6;
    }
    15% {
      fill: rgba(62, 62, 62, 0);
    }
    55% {
      stroke-dashoffset: 0;
      stroke-opacity: 1;
      transform: rotateY(0deg);
    }
    100% {
      fill: rgba(0, 0, 0, 1);
      stroke-dashoffset: 0;
      stroke-width: 0;
    }
  }

  @keyframes flip-left {
    0% {
      filter: blur(50px);
      transform: perspective(2500px) rotateY(-120deg);
    }

    60% {
      filter: blur(0px);
    }
    100% {
      filter: blur(0px);
      transform: perspective(2500px) rotateY(0deg);
    }
  }
</style>
