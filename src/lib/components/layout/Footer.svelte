<script lang="ts">
  import Logo from '$lib/components/Logo/Logo.svelte';
  import LinkIcon from '$lib/components/layout/LinkIcon.svelte';
  import Container from '$lib/components/Container.svelte';

  import Fa from 'svelte-fa';

  import {
    faPhone,
    faShoppingBag,
    faBook,
    faFileAlt,
    faEnvelope,
    faHelmetSafety
  } from '@fortawesome/free-solid-svg-icons';

  import {
    faInstagram,
    faFacebook,
    faLinkedin,
    faWhatsapp
  } from '@fortawesome/free-brands-svg-icons';

  const logo = '/logosmall.png';
  const codiha = '/codiha.svg';
  const footerImage = '/hero.jpg';
</script>

<div class="wrapper-all revert">
  <div class="wrapper revert">
    <img class="footer-image" src={footerImage} alt="" />
  </div>

  <footer>
    <div class="sticker" data-aos="zoom-in" data-aos-duration="500">
      <img src={logo} alt="" />
    </div>

    <Container>
      <div class="content" data-aos="fade-down">
        <section class="branding">
          <div class="logo">
            <Logo />
          </div>

          <p class="description">
            Papiers peints panoramiques, toute la beauté d’un paysage peint à la
            content. Une collection exceptionnelle qui s’enrichit chaque année
            de nouveaux décors. Chaque pièce est un voyage…
          </p>

          <div class="useful">
            <div class="socials">
              <a href="https://www.instagram.com/maisonsdantan" target="_blank">
                <Fa icon={faInstagram} />
              </a>
              <a
                href="https://www.facebook.com/Maisonsdantann/"
                target="_blank"
              >
                <Fa icon={faFacebook} />
              </a>
              <a
                href="https://www.linkedin.com/company/maisons-d-antan/"
                target="_blank"
              >
                <Fa icon={faLinkedin} />
              </a>
            </div>

            <a class="codiha" href="https://www.codiha.com" target="_blank">
              Site web réalisé par l'agence
              <div class="brand">
                <span class="revert"
                  ><img src={codiha} width="15rem" alt="" /></span
                > Codiha (0553 238 410)
              </div>
            </a>
          </div>
        </section>

        <section class="links">
          <div class="wrapper">
            <LinkIcon
              class="link"
              href="/products"
              icon={faShoppingBag}
              name="Nos Collections"
            />

            <LinkIcon
              class="link"
              href="/guide/notice-de-pose"
              icon={faBook}
              name="Notice de pose"
            />

            <LinkIcon
              class="link"
              href="/guide/fiche-technique"
              icon={faFileAlt}
              name="Fiche technique"
            />

            <LinkIcon
              class="link"
              href="/professionels"
              icon={faHelmetSafety}
              name="Pros de Décoration"
            />
          </div>
        </section>

        <section class="informations">
          <div class="info">
            <h2>Nous sommes sur WhatsApp!</h2>
            <a
              class="whatsapp"
              target="_blank"
              href="https://api.whatsapp.com/send?phone=+213559620682&text=Bonjour, je veux passer une commande chez MAISONS D'ANTAN."
            >
              <Fa icon={faWhatsapp} />
              Envoyez-nous un message
            </a>
          </div>

          <div class="info">
            <u>Acceuil Téléphonique</u>
            <ul>
              <li>De samedi à jeudi.</li>
            </ul>
          </div>

          <div class="info">
            <h2>Service Commercial</h2>

            <LinkIcon
              class="link"
              href="mailto:contact@maisonsdantan.co"
              icon={faEnvelope}
              name="contact@maisonsdantan.co"
            />

            <LinkIcon
              class="link"
              href="tel:+213559620682"
              icon={faPhone}
              name="0559 620 682"
            />
          </div>
        </section>
      </div>
    </Container>
  </footer>

  <p class="copyright">
    {new Date().getFullYear()} MAISONS D'ANTAN, tout droits réservés.
  </p>
</div>

<style>
  .whatsapp {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-weight: 500;
    text-decoration: none;

    /* whatsapp background color */
    background-color: #25d366;

    width: fit-content;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);

    cursor: var(--cursor-pointer);

    transition: all var(--animation-duration) ease;
  }

  .whatsapp:hover {
    background-color: #128c7e;
    transform: scale(1.05);
  }

  .whatsapp:active {
    transform: scale(0.95);
  }

  .copyright {
    background-color: black;
    color: white;
    padding: 1rem;
    text-align: center;
    font-family: var(--f-third);
    width: 100%;
  }

  .wrapper {
    width: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .wrapper-all {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;
  }

  .footer-image {
    width: 100%;
  }

  .informations {
    display: flex;
    flex-direction: column;

    font-family: var(--f-third);
    gap: calc(var(--gap) / 2);
  }

  .informations .info {
    display: flex;
    flex-direction: column;
    gap: calc(var(--gap) / 4);
  }

  footer {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: fit-content;
    min-height: var(--min-section-height);
    background-color: rgb(29, 29, 29);
    color: white;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* align-items: flex-start; */
    align-items: center;

    width: 100%;
    padding: calc(var(--gap) * 2) 0;
    gap: var(--gap);
  }

  .content > section {
    flex: 1;
  }

  .logo {
    width: 100%;
    height: fit-content;

    filter: invert();
  }

  .sticker {
    position: absolute;
    top: 0;
    transform: translateY(-50%);

    background-color: white;
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.603);

    padding: 0.8rem;
    border-radius: 50%;
    width: var(--sticker-size);
    height: var(--sticker-size);
  }

  .sticker img:not(.sticker-img) {
    width: 100%;
    height: 100%;
  }

  .socials {
    display: flex;
    flex-direction: row;
    max-width: 110px;
    width: 100%;

    justify-content: space-between;
    align-items: center;
  }

  .socials a {
    color: white;
    font-size: 1.2rem;
  }

  .branding {
    display: flex;
    flex: 1.2 !important;
    flex-direction: column;

    gap: calc(var(--gap) / 2);
  }

  .branding .description {
    text-align: justify;
    font-size: 0.8rem;
  }

  .branding .useful {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--gap) / 2);
  }

  .codiha {
    font-size: 0.8rem;
    color: white;
    text-decoration: none;
    opacity: 0.8;

    font-family: var(--f-third);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .codiha .brand {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    gap: 0.35rem;
  }

  .branding .useful .codiha:visited {
    color: white;
  }

  .branding .useful .codiha:hover {
    text-decoration: underline;
  }

  .links {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
  }

  .links :global(.link),
  .info :global(.link) {
    color: white;
    width: 100%;
    letter-spacing: 1px;
    font-family: var(--f-third);
  }

  .links .wrapper {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  @media screen and (max-width: 1096px) {
    .content {
      flex-direction: column;
      align-items: center;
    }

    .branding {
      text-align: center;
    }

    .branding .description {
      font-size: 0.8rem;
    }

    .branding .useful .socials {
      max-width: 100px;
    }

    .codiha {
      align-self: flex-start;
    }

    .links,
    .informations {
      width: 100%;
      justify-content: left;
    }

    .useful {
      width: 100%;
    }

    .info {
      width: 100%;
      font-size: 0.7rem;
    }
  }
</style>
