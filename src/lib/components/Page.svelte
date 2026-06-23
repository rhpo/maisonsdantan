<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags';
  import Container from './Container.svelte';
  import Fa from 'svelte-fa';
  import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
  import type { Snippet } from 'svelte';

  const informations = {
    name: "MAISONS D'ANTAN",
    title: "MAISONS D'ANTAN - Modernité du papier peint murale.",
    description:
      "Découvrez une incroyable variété de modèles de papier peint provenant des éditeurs de renom à travers le monde, pour donner une touche unique à votre intérieur.",
    url: 'https://maisonsdantan.co',
    image: '/card.jpg'
  };

  interface Props {
    title?: string;
    description?: string;
    url?: string;
    dev?: boolean;
    centered?: boolean;
    centerX?: boolean;
    centerY?: boolean;
    center?: boolean;
    minHeight?: string;
    image?: { url?: string; width?: number; height?: number; alt?: string };
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    title,
    description,
    url,
    dev = false,
    centered = false,
    centerX = false,
    centerY = false,
    center = false,
    minHeight,
    image = {},
    children,
    ...rest
  }: Props = $props();
</script>

<MetaTags
  title={title || informations.title}
  description={description || informations.description}
  canonical={url || informations.url}
  titleTemplate="%s ✱ {informations.name}"
  openGraph={{
    title: informations.title,
    description: informations.description,
    url: informations.url,
    siteName: informations.name,
    images: [
      {
        url: image.url || informations.image,
        width: image.width ?? 1200,
        height: image.height ?? 630,
        alt: image.alt || informations.title
      }
    ]
  }}
/>

{#if dev}
  <main class="centered">
    <Container addClass="container-wrap" center>
      <div class="content">
        <div class="informations">
          <h1>
            <Fa icon={faClockRotateLeft} />
            Site en construction
          </h1>
        </div>

        <p>
          <a href="/"> Retour à la page d'accueil </a>
        </p>
      </div>
    </Container>
  </main>
{:else}
  <main class:centered>
    <Container addClass="container-wrap" {centerX} {centerY} {center} {minHeight} {...rest}>
      {#if children}{@render children()}{/if}
    </Container>
  </main>
{/if}

<style>
  :global(.container-wrap) {
    flex: 1;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--gap);
    text-align: center;
    max-width: calc(100% * var(--inner-scale));
  }

  .informations {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: calc(var(--gap) / 2);
  }

  main :global(.container-wrap > div) {
    height: unset !important;
    min-height: 100% !important;
  }

  main {
    width: 100%;

    min-height: 100vh;

    display: flex;
    flex-direction: column;

    background-color: var(--primary);
    padding-top: var(--page-padding);
    color: var(--secondary);

    padding-bottom: var(--page-padding-real);
    transition: all var(--animation-duration);
  }

  main.centered {
    padding-top: var(--nav-height) !important;
  }

  main :global(*) {
    font-family: var(--f-third);
  }
</style>
