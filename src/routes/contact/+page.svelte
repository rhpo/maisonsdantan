<script lang="ts">
  import { enhance } from '$app/forms';
  import Page from '$lib/components/Page.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
  import {
    faEnvelope,
    faPaperPlane,
    faPhone,
    faUser
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
  let submitting = $state(false);

  let nameValue = $state('');
  let phoneValue = $state('');
  let emailValue = $state('');

  const nameTransform = (name: string) =>
    name
      .replace(/\s+/g, ' ')
      .trimStart()
      .split(' ')
      .map((word) => (word[0] || '').toUpperCase() + word.slice(1))
      .join(' ');

  function phoneFormat(phone: string) {
    phone = phone
      .replace(/\s+/g, '')
      .replace(/[^0-9+]/g, '')
      .replace('+213', '')
      .replace('+', '')
      .replace('0', '');

    const parts: string[] = [];
    const max = 3;

    for (let i = 0; i < phone.length && parts.length < max; i += 3) {
      parts.push(phone.slice(i, i + 3));
    }

    return '0' + parts.join(' ');
  }

  const emailVerify = (email: string) =>
    !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const emailTransform = (email: string) =>
    email
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/@+/g, '@')
      .replace(/\.+/g, '.')
      .replace(/[^a-zA-Z0-9@.]/g, '')
      .replace(/@+/g, '@');
</script>

<Page
  centerX
  centerY
  title="Contact"
  description="Vous pouvez nous contacter en utilisant le formulaire ci-dessous."
>
  <div class="wrapper">
    <div class="info">
      <h1>Contact</h1>
      <p>
        Vous pouvez nous contacter en utilisant le formulaire ci-dessous.
      </p>

      <br />

      <a
        class="whatsapp"
        target="_blank"
        href="https://api.whatsapp.com/send?phone=+213559620682&text=Bonjour, je veux passer une commande chez MAISONS D'ANTAN."
      >
        <Fa icon={faWhatsapp} />
        Contactez-nous sur WhatsApp !
      </a>
    </div>

    {#if form?.success}
      <div class="info">
        <p>Votre message a été envoyé avec succès.</p>
      </div>
    {:else}
      <form
        class="form"
        method="POST"
        use:enhance={() => {
          submitting = true;
          return async ({ update }) => {
            submitting = false;
            await update();
          };
        }}
      >
        <Input
          placeholder="Nom & Prénom"
          icon={faUser}
          name="name"
          transform={nameTransform}
          bind:value={nameValue}
          required
        />

        <Input
          placeholder="Numéro de téléphone"
          icon={faPhone}
          type="tel"
          name="phone"
          transform={phoneFormat}
          bind:value={phoneValue}
          required
        />

        <Input
          placeholder="Email"
          icon={faEnvelope}
          name="email"
          verify={emailVerify}
          transform={emailTransform}
          bind:value={emailValue}
          required
        />

        <div class="textarea-wrap">
          <textarea name="message" placeholder="Message" rows="6" required></textarea>
        </div>

        {#if form?.error}<p class="error">{form.error}</p>{/if}

        <div class="bottom-info">
          <Button
            title={submitting ? 'Envoi...' : 'Envoyer'}
            icon={faPaperPlane}
            type="submit"
            disabled={submitting}
          />

          <div class="contact-social">
            <a
              target="_blank"
              href="https://api.whatsapp.com/send?phone=+213559620682&text=Bonjour,%20je%20veux%20passer%20une%20commande%20chez%20MAISONS%20D%27ANTAN."
            >
              <Fa icon={faWhatsapp} />
            </a>

            <a href="https://instagram.com/maisonsdantan" target="_blank">
              <Fa icon={faInstagram} />
            </a>

            <a target="_blank" href="tel:+213559620682">
              <Fa icon={faPhone} />
            </a>
          </div>
        </div>
      </form>
    {/if}
  </div>
</Page>

<style>
  .whatsapp {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-weight: 500;
    text-decoration: none;

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

  .contact-social {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  .contact-social a {
    font-size: 2rem;
    color: var(--secondary);

    transition: transform var(--animation-duration);
  }

  .contact-social a:hover {
    transform: scale(0.9);
  }

  .bottom-info {
    margin-top: 0.2rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 0.8rem;
  }

  .textarea-wrap textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: var(--radius);
    font-family: var(--f-third);
    font-size: 1rem;
    resize: vertical;
    outline: none;
    background: #f9f9f9;
  }

  .textarea-wrap textarea:focus {
    border-color: var(--secondary);
  }

  .error {
    color: var(--red);
    font-family: var(--f-third);
    font-size: 0.9rem;
  }

  .wrapper {
    width: 100%;
    height: 100%;

    max-width: var(--inner-maxw);

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
  }

  .info {
    height: fit-content;
  }
</style>
