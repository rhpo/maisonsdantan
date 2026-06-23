<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import { faSearch, faSkullCrossbones, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
	import Input from '$lib/components/ui/Input.svelte';
	import Loading from '$lib/components/admin/Loading.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let approvedFilter = $state('');
	let pendingFilter = $state('');

	let submitting = $state(false);
	const track = () => {
		submitting = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			submitting = false;
			await update();
		};
	};

	let authorized = $derived(data.users.filter((u) => u.status === 'authorized'));
	let pending = $derived(data.users.filter((u) => u.status === 'pending'));

	let authorizedFiltered = $derived(
		authorized.filter((u) => u.display_name.toLowerCase().includes(approvedFilter.toLowerCase()))
	);
	let pendingFiltered = $derived(
		pending.filter((u) => u.display_name.toLowerCase().includes(pendingFilter.toLowerCase()))
	);
</script>

<Loading show={submitting} />

<h2>&bull; Administrators</h2>

<Input placeholder="Search users..." name="Search Admins" icon={faSearch} bind:value={approvedFilter} />

{#if authorizedFiltered.length > 0}
	{#each authorizedFiltered as user}
		<div class="card">
			<div class="everything">
				<div class="avatar">
					{#if user.photo_url}
						<img src={user.photo_url} alt="" />
					{:else}
						<span class="placeholder">{user.display_name[0]}</span>
					{/if}
				</div>

				<div class="informations">
					<h3 class="name">{user.display_name}</h3>
					<p class="email">{user.email}</p>
				</div>
			</div>

			<div class="actions">
				<form method="POST" action="?/revoke" use:enhance={track}>
					<input type="hidden" name="userId" value={user.id} />
					<input type="hidden" name="name" value={user.display_name} />
					<button type="submit" class="danger">
						<Fa icon={faSkullCrossbones} /> Remove
					</button>
				</form>
			</div>
		</div>
	{/each}
{:else}
	<p>No administrators found.</p>
{/if}

<h2>&bull; Pending Requests</h2>
<Input placeholder="Search users..." name="Search Pending Users" icon={faSearch} bind:value={pendingFilter} />

{#if pendingFiltered.length > 0}
	{#each pendingFiltered as user}
		<div class="card">
			<div class="everything">
				<div class="avatar">
					{#if user.photo_url}
						<img src={user.photo_url} alt="" />
					{:else}
						<span class="placeholder">{user.display_name[0]}</span>
					{/if}
				</div>

				<div class="informations">
					<h3 class="name">{user.display_name}</h3>
					<p class="email">{user.email}</p>
				</div>
			</div>

			<div class="actions">
				<form method="POST" action="?/authorize" use:enhance={track}>
					<input type="hidden" name="userId" value={user.id} />
					<input type="hidden" name="name" value={user.display_name} />
					<button type="submit" class="primary"><Fa icon={faCheckSquare} /> Approve</button>
				</form>
				<form method="POST" action="?/revoke" use:enhance={track}>
					<input type="hidden" name="userId" value={user.id} />
					<input type="hidden" name="name" value={user.display_name} />
					<button type="submit" class="danger"><Fa icon={faSkullCrossbones} /> Deny</button>
				</form>
			</div>
		</div>
	{/each}
{:else}
	<p>No pending requests found.</p>
{/if}

<style>
	h2 {
		margin-top: 1.5rem;
	}

	.actions {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
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

	.card img {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}

	.placeholder {
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

	.avatar {
		margin-right: 15px;
	}

	.informations > * {
		margin: 0;
	}

	.everything {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.primary,
	.danger {
		border: none;
		border-radius: var(--radius);
		padding: 8px 14px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		justify-content: center;
		transition: all 0.2s;
	}

	.primary {
		background: black;
		color: white;
	}

	.danger {
		background: red;
		color: white;
	}

	.primary:hover,
	.danger:hover {
		transform: scale(1.03);
	}
</style>
