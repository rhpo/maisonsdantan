<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    centerX?: boolean;
    centerY?: boolean;
    center?: boolean;
    addClass?: string;
    minHeight?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    centerX = false,
    centerY = false,
    center = false,
    addClass = '',
    minHeight,
    children,
    ...rest
  }: Props = $props();
</script>

<div class="main {addClass}" style="height: fit-content;" {...rest}>
  <div
    class="container"
    style="min-height: {minHeight ? minHeight : 'unset'}; height: fit-content;"
    class:center
    class:center-x={centerX}
    class:center-y={centerY}
  >
    {#if children}{@render children()}{/if}
  </div>
</div>

<style>
  .main {
    height: 1px; /* to give it access to min-height */
    display: flex;
    justify-content: center;
    width: 100%;

    padding: var(--margin);
    padding-top: 0;
    padding-bottom: 0;
  }

  .container {
    width: 100%;
    max-width: var(--maxw);
  }

  .container.center-x {
    display: flex;
    justify-content: center;
  }

  .container.center-y {
    display: flex;
    align-items: center;
  }

  .container.center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 810px) {
    .main {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
</style>
