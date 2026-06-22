<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let status = $derived($page.url.searchParams.get('status'));
	let submitting = $state(false);

	const messages: Record<string, string> = {
		pending: 'Votre demande d\'accès est en attente d\'approbation.',
		unauthorized: 'Vous n\'êtes pas autorisé à accéder au panneau d\'administration.',
		error: 'Une erreur d\'authentification est survenue.'
	};
</script>

<div class="login-page">
	<div class="card">
		<h1>MAISONS D'ANTAN</h1>
		<p class="sub">Administration</p>

		{#if status && messages[status]}
			<div class="alert" class:warning={status === 'pending'} class:error={status !== 'pending'}>
				{messages[status]}
			</div>
		{/if}

		<form method="POST" action="?/login" use:enhance={() => {
			submitting = true;
			return async ({ update }) => { submitting = false; await update(); };
		}}>
			<button type="submit" class="google-btn" disabled={submitting}>
				<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
				{submitting ? 'Connexion...' : 'Continuer avec Google'}
			</button>
		</form>
	</div>
</div>

<style>
	:global(body) { background: #f0f0f0; }

	.login-page {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
	}

	.card {
		background: white;
		border-radius: 8px;
		padding: 3rem 2.5rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 4px 24px rgba(0,0,0,0.08);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		text-align: center;
	}

	h1 {
		font-family: var(--f-primary);
		font-size: 1.5rem;
		letter-spacing: 0.2rem;
	}

	.sub {
		font-family: var(--f-third);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		opacity: 0.4;
		margin-top: -1rem;
	}

	.alert {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		font-family: var(--f-third);
		font-size: 0.85rem;
	}

	.alert.warning { background: #fff3cd; color: #856404; }
	.alert.error { background: #f8d7da; color: #842029; }

	.google-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		border: 1px solid #dadce0;
		border-radius: 4px;
		background: white;
		font-family: var(--f-third);
		font-size: 0.95rem;
		cursor: var(--cursor-pointer);
		transition: all var(--animation-duration);
		white-space: nowrap;
	}

	.google-btn:hover { background: #f8f8f8; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
	.google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
