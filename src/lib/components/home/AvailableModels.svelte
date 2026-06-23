<script lang="ts">
  import Image from '$lib/components/Image.svelte';
  import Container from '$lib/components/Container.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { splitChunks } from '$lib/utility';
  import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

  const images = Array.from({ length: 16 }, (_, n) => `/models/${n + 1}.jpg`);

  const chunks = splitChunks(images, images.length / 4);
</script>

<Container center>
  <div class="poster">
    <div class="content">
      <div class="info">
        <h1>Des papiers peints panoramiques</h1>
        <p>
          Les décors Maisons d’Antan, uniques et intemporels, transforment vos
          intérieurs avec des papiers peints panoramiques sur mesure. Nos
          modèles, inspirés d’ambiances variées, s’adaptent à votre style et à
          de grandes dimensions.
        </p>
      </div>

      <Button
        url="/products"
        title="DÉCOUVRIR NOS COLLECTIONS"
        icon={faShoppingBag}
      />

      <div class="images" data-aos="fade-left">
        {#each chunks as chunk}
          <div class="frame" data-aos="slide-left">
            <div class="img">
              <Image src={chunk} interval={2000} alt="model" />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</Container>

<style>
  .img {
    height: fit-content;
    position: relative;
    box-shadow: 9px 10px 5px 0px rgba(0, 0, 0, 0.2);

    width: 100%;
    aspect-ratio: 3 / 4;
  }
  .poster {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    text-align: center;
    max-width: calc(100% * var(--inner-scale));
  }

  /* Informations */
  .info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info h1 {
    font-size: var(--heading-size);
  }

  .info p {
    font-size: var(--paragraph-size);
  }

  /* Images, Images => Frame */
  .images {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: fit-content;

    transition: all 5s cubic-bezier(0.12, 0.78, 0, 0.99);
  }

  .images .frame {
    width: 100%;

    display: flex;
    justify-content: space-around;
    align-items: center;

    transition: all 5s cubic-bezier(0.12, 0.78, 0, 0.99);
  }

  @media screen and (max-width: 785px) {
    .info h1 {
      font-size: 40px;
      text-align: left;
      word-break: normal;
    }

    .info p {
      font-size: 18px;
      text-align: left;
    }

    .images {
      flex-direction: column;
    }

    .images .frame {
      transition: all 1s cubic-bezier(0.12, 0.78, 0, 0.99);
    }
  }
</style>
