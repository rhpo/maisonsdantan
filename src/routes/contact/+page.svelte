<script lang="ts">
	import { enhance } from '$app/forms';
	import Page from '$lib/components/Page.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { faPaperPlane, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

<Page title="Contact" description="Écrivez-nous, nous vous répondrons rapidement.">
	{#if form?.success}
		<div class="success">
			<h2>Message envoyé ✓</h2>
			<p>Nous vous répondrons dans les meilleurs délais.</p>
		</div>
	{:else}
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => { submitting = false; await update(); };
			}}
		>
			<Input placeholder="Nom & Prénom *" icon={faUser} name="name" required />
			<Input placeholder="Email *" icon={faEnvelope} name="email" type="email" required />
			<Input placeholder="Téléphone" icon={faPhone} name="phone" type="tel" />
			<div class="textarea-wrap">
				<textarea name="message" placeholder="Votre message *" rows="6" required></textarea>
			</div>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
			<Button title={submitting ? 'Envoi...' : 'Envoyer'} icon={faPaperPlane} type="submit" disabled={submitting} />
		</form>
	{/if}
</Page>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: var(--inner-maxw);
	}

	.textarea-wrap textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: var(--radius);
		font-family: var(--f-second);
		font-size: 1rem;
		resize: vertical;
		outline: none;
		background: #f9f9f9;
	}

	.textarea-wrap textarea:focus {
		border-color: var(--secondary);
	}

	.success {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2rem;
		background: var(--sub);
		border-radius: var(--radius);
		max-width: var(--inner-maxw);
	}

	.error {
		color: var(--red);
		font-family: var(--f-third);
		font-size: 0.9rem;
	}
</style>
