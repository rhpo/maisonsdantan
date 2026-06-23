<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import { faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
	import Loading from '$lib/components/admin/Loading.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	const track = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	function since(date: string) {
		const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
		const units: [number, string][] = [
			[60, 'seconde'],
			[60, 'minute'],
			[24, 'heure'],
			[30, 'jour'],
			[12, 'mois'],
			[Infinity, 'an']
		];
		let value = diff;
		let i = 0;
		for (; i < units.length - 1 && value >= units[i][0]; i++) value = Math.floor(value / units[i][0]);
		const label = units[i][1];
		return `il y a ${value} ${label}${value > 1 && label !== 'mois' ? 's' : ''}`;
	}

	let seconds = $state(0);
	$effect(() => {
		const t = setInterval(() => seconds++, 1000);
		return () => clearInterval(t);
	});
</script>

<Loading show={submitting} />

{#if data.messages.length === 0}
	<p>Aucun message.</p>
{:else}
	<div class="wrapper">
		<div class="messages">
			{#each data.messages as message}
				<div class="message" class:unread={!message.read}>
					<div class="author">
						<div class="client">
							<Fa icon={faUser} />
							{message.name} ({message.email.toLowerCase()} - {message.phone?.replaceAll('+213', '0')})
							<span style="opacity: 0.5">#{message.id}</span>
						</div>
						<div class="actions">
							{#if !message.read}
								<form method="POST" action="?/markRead" use:enhance={track}>
									<input type="hidden" name="id" value={message.id} />
									<button type="submit" class="mark">Marquer lu</button>
								</form>
							{/if}
							<form method="POST" action="?/delete" use:enhance={track}>
								<input type="hidden" name="id" value={message.id} />
								<button type="submit" class="remove">
									<Fa icon={faTrashCan} /> Supprimer
								</button>
							</form>
						</div>
					</div>

					<div class="chatbox">
						<p class="content">{message.message}</p>

						<div class="since">
							{#key seconds}
								{since(message.created_at)}
							{/key}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.messages {
		display: flex;
		flex-direction: column;

		gap: 2rem;

		width: 100%;
		max-width: 80%;
	}

	.wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.author {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		gap: 0.5em;
	}

	.actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.chatbox {
		display: flex;
		flex-direction: column;
		margin-left: 1em;

		border-radius: 0.5em 0.5em 0.5em 0;

		background: black;
		color: #fff;

		padding: 0.5em;
	}

	.since {
		font-size: 0.8em;
		opacity: 0.8;
	}

	.chatbox p {
		margin: 0;
	}

	.message {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.mark,
	.remove {
		border: none;
		border-radius: var(--radius);
		padding: 8px 14px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		transition: all 0.2s;
	}

	.mark {
		background: rgb(240, 240, 240);
		color: black;
	}

	.remove {
		background: red;
		color: white;
	}

	.mark:hover,
	.remove:hover {
		transform: scale(1.03);
	}
</style>
