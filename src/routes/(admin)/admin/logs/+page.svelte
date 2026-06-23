<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowRight, faStopwatch } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

{#if data.logs.length === 0}
	<p>Aucune action n'a été effectuée.</p>
{:else}
	<div class="wrapper">
		<div class="logs">
			{#each data.logs as log}
				<div class="log">
					<div class="card">
						<div class="everything">
							<div class="avatar">
								<span>{(log.admin_users?.display_name ?? log.user_name ?? '?')[0]}</span>
							</div>

							<div class="informations">
								<div class="admin">
									<h3 class="name">{log.admin_users?.display_name ?? log.user_name ?? 'Système'}</h3>
									<p class="email">{log.admin_users?.email ?? ''}</p>

									<p class="action">
										<Fa icon={faArrowRight} />
										{log.action}
									</p>
								</div>

								<span class="since">
									<Fa icon={faStopwatch} />
									{#key seconds}
										<p>{since(log.created_at)}</p>
									{/key}
								</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.action {
		margin-top: 5px !important;
	}

	.logs {
		width: 100%;
	}

	.since {
		display: flex;
		align-items: center;
		gap: 5px;
		opacity: 0.5;
	}

	.since * {
		margin: 0;
		font-size: 14px;
	}

	.card {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #f8f8f8;
		border: 1px solid rgb(238, 238, 238);
		border-radius: 8px;
		padding: 15px;
		margin-top: 15px;
	}

	.avatar {
		margin-right: 15px;
	}

	.avatar span {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: black;
		color: white;
		font-weight: 600;
		text-transform: uppercase;
	}

	.informations .admin > * {
		margin: 0;
	}

	.informations {
		display: flex;
		justify-content: space-between;
		align-items: center;

		width: 100%;
	}

	.everything {
		display: flex;
		flex-direction: row;
		align-items: center;

		width: 100%;
	}
</style>
