<script lang="ts">
  import Page from '$lib/components/Page.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

  const pdf = '/catalogue.pdf';
</script>

<Page
  title="Catalogue - Document Officiel"
  description="Téléchargez le catalogue de nos produits"
>
  <div class="content">
    <Button title="Télécharger notre Catalogue" icon={faArrowDown} url={pdf} />

    <iframe
      title="Catalogue"
      src={pdf}
      style="aspect-ratio: 16/9;"
      width="100%"
    ></iframe>
  </div>
</Page>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 20px;

    height: 100%;
  }
</style>
