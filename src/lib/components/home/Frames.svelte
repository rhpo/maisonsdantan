<script lang="ts">
  import Image3D from '$lib/components/Image3D.svelte';
  import Container from '$lib/components/Container.svelte';

  const s1 = '/models/s1.jpg';
  const s2 = '/models/s2.jpg';
  const s3 = '/models/s3.jpg';
  const s4 = '/models/s4.jpg';
</script>

<Container center>
  <div class="poster">
    <div class="content">
      <div class="info">
        <h1 data-aos="fade-right" data-aos-duration="1500">
          Découvrez une autre façon de vivre...
        </h1>
        <p data-aos="fade-up" data-aos-duration="1500" data-aos-delay="750">
          Explorez une nouvelle façon de vivre avec le papier peint panoramique,
          révélant une expérience unique et captivante.
        </p>
      </div>

      <div class="images" data-listener>
        <Image3D src={s4} />
        <Image3D src={s2} />
        <Image3D src={s1} />
        <Image3D src={s3} />
      </div>
    </div>
  </div>
</Container>

<style>
  .poster {
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    max-width: calc(100% * var(--inner-scale));
  }

  .info {
    text-align: center;
    margin-bottom: 2rem;
  }

  .info p {
    font-size: var(--paragraph-size);
  }

  .info h1 {
    font-size: var(--heading-size);
    margin-bottom: 1rem;
  }

  .images {
    width: 100%;
    height: 500px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.8rem;

    filter: blur(5px);
    transform: scale(0.8);

    transition: all 5s cubic-bezier(0.12, 0.78, 0, 0.99);
  }

  .images:global(.shown) {
    transform: scale(1);
    filter: blur(0);
  }

  @media screen and (max-width: 777px) {
    .info {
      text-align: left;
    }

    .info h1 {
      font-size: 40px;
    }

    .info p {
      font-size: 18px;
      text-align: justify;
    }
  }

  @media screen and (max-width: 785px) {
    .images {
      display: flex;
      flex-direction: column-reverse;
    }
  }
</style>
