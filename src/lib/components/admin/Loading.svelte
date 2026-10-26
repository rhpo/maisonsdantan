<script lang="ts">
  import Fa from 'svelte-fa';
  import { faSpinner } from '@fortawesome/free-solid-svg-icons';
  import { fade } from 'svelte/transition';

  let { show = false, label = '' }: { show?: boolean; label?: string } = $props();
</script>

{#if show}
  <div class="overlay" transition:fade={{ duration: 150 }}>
    <div class="spin"><Fa icon={faSpinner} spin /></div>
    {#if label}<p class="label">{label}</p>{/if}
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;

    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    justify-content: center;
    align-items: center;

    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(2px);
  }

  .spin {
    font-size: 4rem;
    color: black;
  }

  .label {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    text-align: center;
  }
</style>
