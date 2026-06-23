<script lang="ts">
  import { scale } from "svelte/transition";
  import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import Container from "$lib/components/Container.svelte";
  import Notification from "./Notification.svelte";
  import Link from "./Link.svelte";
  import Links from "./Links.svelte";
  import Logo from "$lib/components/Logo/Logo.svelte";
  import { cart } from "$lib/stores/cart.svelte";
  import { ui } from "$lib/stores/ui.svelte";

  let headerEl: HTMLElement;

  const palmier = "/icons/palmier.svg";
  const dromadaire = "/icons/dromadaire.svg";

  function setupScroll() {
    let prev = 0;
    const logoEl = document.querySelector(".logo");
    window.addEventListener("scroll", () => {
      const progress =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      document.documentElement.style.setProperty("--progress", progress + "%");

      const newTop = window.scrollY;
      const method = newTop > prev ? "add" : "remove";
      headerEl?.classList[method]("shrunk");
      logoEl?.classList[method]("shrunk");

      const full = "calc(var(--header-height) + var(--notification-height))";
      const shrunk =
        "calc(var(--header-height) * var(--nav-scalar) + var(--notification-height))";
      document.documentElement.style.setProperty(
        "--nav-height",
        newTop > prev ? shrunk : full,
      );

      prev = newTop;
    });
  }

  $effect(() => {
    setupScroll();

    if (ui.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
</script>

<nav>
  <Notification />

  <div class="head">
    <Container>
      <header bind:this={headerEl}>
        <div class="item navigation">
          <div class="links">
            <Links />
          </div>
        </div>

        <div class="item main-item centered limited">
          <button
            class="hamburger hidden"
            onclick={() => ui.toggleMenu()}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
          <div class="logo-wrap">
            <Logo />
          </div>
          <button class="theme mobile" onclick={() => ui.toggleDark()}>
            {#if ui.darkMode}
              <div class="icon" transition:scale><Fa icon={faSun} /></div>
            {:else}
              <div class="icon" transition:scale><Fa icon={faMoon} /></div>
            {/if}
          </button>
        </div>

        <div class="item">
          <div class="controls">
            <Link
              url="/guide/catalogue"
              icon={palmier}
              name="Catalogue"
              description="Voir les produits disponibles."
            />

            <Link
              url="/panier"
              icon={dromadaire}
              name="Panier{cart.count > 0 ? ` (${cart.count})` : ''}"
              description="Voir votre panier et vos achats en cours."
            />

            <button class="theme" onclick={() => ui.toggleDark()}>
              {#if ui.darkMode}
                <div class="icon" transition:scale><Fa icon={faSun} /></div>
              {:else}
                <div class="icon" transition:scale><Fa icon={faMoon} /></div>
              {/if}
            </button>
          </div>
        </div>
      </header>
    </Container>

    <div class="progress-wrapper">
      <div class="progress"></div>
    </div>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  .theme {
    padding: 0;
    background: none;
    border: none;
    outline: none;

    aspect-ratio: 9 / 13;
    cursor: var(--cursor-pointer);

    position: relative;

    height: 100%;
  }

  .theme .icon {
    font-size: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--animation-duration) ease;
  }

  .theme:hover .icon {
    transform: translate(-50%, -50%) scale(1.1);
  }

  .head {
    position: relative;

    /* glass effect */
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .progress-wrapper {
    width: 100%;
    border-radius: var(--progress-height);
    overflow: hidden;
    height: var(--progress-height);

    opacity: 0.5;

    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1000;
  }

  .progress {
    width: var(--progress);
    background-color: var(--secondary);
    height: 100%;
  }

  .limited {
    padding-left: 0;
    padding-right: 0;
  }

  header {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: var(--header-height);
    transition: all var(--animation-duration) ease;
  }

  :global(header.shrunk) {
    height: calc(var(--header-height) * var(--nav-scalar)) !important;
  }

  header > * {
    flex-grow: 1;
    flex-basis: 0;
  }

  .item {
    flex: 1;
    height: 100%;

    display: flex;
    align-items: center;
  }

  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .links {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
  }

  .links > :global(*) {
    width: calc(100% / 3);
  }

  .controls {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    float: right;
  }

  .hidden {
    display: none;
  }

  .logo-wrap {
    height: 100%;
    transition: all var(--animation-duration) ease;
    max-height: calc(var(--header-height) * var(--nav-scalar));
  }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: var(--cursor-pointer);
    padding: 0;
  }

  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--secondary);
    border-radius: 2px;
    transition: all var(--animation-duration);
  }

  .theme.mobile {
    display: none;
    width: 30px;
  }

  @media screen and (max-width: 1050px) {
    .navigation {
      display: none;
    }

    .centered {
      justify-content: flex-start;
    }

    .hidden {
      display: flex;
    }

    .main-item {
      gap: 1.2rem;
    }
  }

  @media screen and (max-width: 810px) {
    .item:not(.main-item) {
      display: none;
    }

    .theme {
      display: none;
    }

    .theme.mobile {
      display: block !important;
    }

    :global(html) {
      --margin: 2rem !important;
    }

    .main-item {
      flex-grow: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--margin);
    }
  }

  @media screen and (max-width: 420px) {
    .logo-wrap {
      height: fit-content;
    }
  }
</style>
