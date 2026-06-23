<script lang="ts">
  import Link from './Link.svelte';
  import { cart } from '$lib/stores/cart.svelte';

  import { faHome, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

  let { mobile = false }: { mobile?: boolean } = $props();

  const dromadaire = '/icons/dromadaire.svg';
  const palmier = '/icons/palmier.svg';
</script>

<Link
  url="/"
  icon={faHome}
  name="Home"
  description="Accéder à la page d'acceuil."
  inline={mobile}
/>
<Link
  url="/products"
  icon={faShoppingBag}
  name="Produits"
  description="Découvrir diverts produits et papiers peints."
  inline={mobile}
/>
<Link
  url="/contact"
  icon={faPhone}
  name="Contact"
  description="Contacter nous vers E-Mail ou numéro de téléphone."
  inline={mobile}
/>

{#if mobile}
  <br />
  <br />

  <Link
    url="/panier"
    icon={dromadaire}
    inline={mobile}
    name="Panier {cart.count > 0 ? ` (${cart.count})` : ``}"
    description="Voir votre panier et vos achats en cours."
  />

  <Link
    url="/guide/catalogue"
    icon={palmier}
    inline={mobile}
    name="Catalogue"
    description="Voir les produits disponibles."
  />
{/if}
