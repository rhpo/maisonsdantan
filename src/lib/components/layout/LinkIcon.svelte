<script lang="ts">
  import Fa from 'svelte-fa';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    icon?: IconDefinition;
    name?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { href = '#', icon, name, class: className = '', children, ...rest }: Props = $props();
</script>

<a {href} class={className} {...rest}>
  <div class="icon">
    {#if icon}
      <Fa {icon} />
    {/if}
  </div>
  {name}
  {#if children}{@render children()}{/if}
</a>

<style>
  a {
    display: inline-flex;
    gap: 0.5rem;

    text-decoration: none;
    text-transform: uppercase;
  }

  a:hover {
    text-decoration: underline;
  }

  a:visited {
    color: inherit;
  }

  a:hover .icon {
    opacity: 0.8;
  }

  .icon {
    width: fit-content;
    min-width: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
