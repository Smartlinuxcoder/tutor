<script>
	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="glass-card w-full max-w-md rounded-md p-8">
		<h2 class="mb-6 text-center text-2xl font-bold" style="color: var(--text-primary);">Accedi</h2>

		{#if form?.error}
			<div class="mb-4 rounded-md bg-red-500/20 border border-red-500/30 p-3 text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium" style="color: var(--text-secondary);">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					class="input-glass mt-1 block w-full rounded-md p-2.5"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium" style="color: var(--text-secondary);">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input-glass mt-1 block w-full rounded-md p-2.5"
				/>
			</div>

			<button
				type="submit"
				class="btn-primary w-full rounded-md px-4 py-2.5 font-semibold"
			>
				Accedi
			</button>
		</form>
		<p class="mt-4 text-center text-sm" style="color: var(--text-muted);">
			Non hai un account? <a href="/register" class="font-medium hover:underline" style="color: var(--accent);">Registrati</a>
		</p>
	</div>
</div>
