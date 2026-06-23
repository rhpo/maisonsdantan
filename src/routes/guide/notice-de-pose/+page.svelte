<script lang="ts">
  import Page from '$lib/components/Page.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

  const pdf = '/guide.jpg';
</script>

<Page
  title="Notice de pose - Document Officiel"
  description="Téléchargez le guide de pose de nos produits"
>
  <div class="content">
    <Button title="Télécharger le guide de pose" icon={faArrowDown} url={pdf} />

    <iframe
      title="GUIDE DE POSE"
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
