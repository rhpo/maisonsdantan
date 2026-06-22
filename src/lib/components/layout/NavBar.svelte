<script lang="ts">
  import { scale } from "svelte/transition";
  import {
    faMoon,
    faSun,
    faShoppingBag,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import Container from "$lib/components/Container.svelte";
  import Notification from "./Notification.svelte";
  import Link from "./Link.svelte";
  import { cart } from "$lib/stores/cart.svelte";
  import { ui } from "$lib/stores/ui.svelte";

  let headerEl: HTMLElement;

  function setupScroll() {
    let prev = 0;
    window.addEventListener("scroll", () => {
      const progress =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      document.documentElement.style.setProperty("--progress", progress + "%");

      const newTop = window.scrollY;
      const method = newTop > prev ? "add" : "remove";
      headerEl?.classList[method]("shrunk");

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
            <Link
              url="/products"
              name="Collection"
              icon="/icons/palmier.svg"
              description="Voir nos modèles de papier peint."
            />
            <Link
              url="/professionels"
              name="Professionnels"
              icon="/icons/dromadaire.svg"
              description="Espace professionnel."
            />
            <Link
              url="/contact"
              name="Contact"
              icon="/icons/contact.svg"
              description="Nous contacter."
            />
          </div>
        </div>

        <div class="item centered limited">
          <button
            class="hamburger hidden"
            onclick={() => ui.toggleMenu()}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
          <div class="logo-wrap">
            <a href="/" class="logo-link">
              <img src="/logo.svg" alt="MAISONS D'ANTAN" />
            </a>
          </div>
          <button class="theme mobile" onclick={() => ui.toggleDark()}>
            {#if ui.darkMode}
              <div class="icon" transition:scale><Fa icon={faSun} /></div>
            {:else}
              <div class="icon" transition:scale><Fa icon={faMoon} /></div>
            {/if}
          </button>
        </div>

        <div class="item controls">
          <Link
            url="/guide/catalogue"
            name="Catalogue"
            icon="/icons/palmier.svg"
          />
          <Link
            url="/panier"
            name="Panier{cart.count > 0 ? ` (${cart.count})` : ''}"
            icon="/icons/dromadaire.svg"
            description="Voir votre panier."
          />
          <button class="theme" onclick={() => ui.toggleDark()}>
            {#if ui.darkMode}
              <div class="icon" transition:scale><Fa icon={faSun} /></div>
            {:else}
              <div class="icon" transition:scale><Fa icon={faMoon} /></div>
            {/if}
          </button>
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

  .head {
    position: relative;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--header-height);
    transition: height var(--animation-duration);
  }

  :global(header.shrunk) {
    height: calc(var(--header-height) * var(--nav-scalar)) !important;
  }

  .item {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .centered {
    justify-content: center;
  }

  .controls {
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .links {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  :global(.links > *) {
    width: calc(100% / 3);
  }

  .logo-link {
    text-decoration: none;
  }

  .logo-text {
    font-family: var(--f-primary);
    font-size: 1.4rem;
    letter-spacing: 0.2rem;
    color: var(--secondary);
    white-space: nowrap;
  }

  .logo-wrap {
    transition: all var(--animation-duration);
  }

  .theme {
    padding: 0;
    background: none;
    border: none;
    width: 30px;
    aspect-ratio: 1;
    position: relative;
    cursor: var(--cursor-pointer);
  }

  .icon {
    font-size: 1.3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all var(--animation-duration);
  }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: var(--cursor-pointer);
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--secondary);
    border-radius: 2px;
    transition: all var(--animation-duration);
  }

  .progress-wrapper {
    width: 100%;
    height: var(--progress-height);
    overflow: hidden;
    opacity: 0.5;
  }

  .progress {
    width: var(--progress);
    background-color: var(--secondary);
    height: 100%;
    transition: width 0.1s linear;
  }

  .theme.mobile {
    display: none;
  }

  .limited {
    padding: 0;
  }

  @media screen and (max-width: 1050px) {
    .navigation {
      display: none;
    }

    .hamburger {
      display: flex !important;
    }
  }

  @media screen and (max-width: 810px) {
    .controls {
      display: none;
    }

    .theme.mobile {
      display: block;
    }
  }
</style>
