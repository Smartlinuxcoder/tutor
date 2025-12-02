<script>
	let { form } = $props();
</script>

<div class="relative flex min-h-screen items-center justify-center p-4">
	<div class="glass-card w-full max-w-md">
		<div class="mb-8 text-center">
			<h2 class="mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
				Bentornato!
			</h2>
			<p class="text-gray-600 dark:text-gray-400">Accedi al tuo account</p>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded-lg bg-red-100/80 dark:bg-red-900/30 p-4 text-red-700 dark:text-red-300 backdrop-blur">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-5">
			<div>
				<label for="username" class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					class="input-glass"
					placeholder="Inserisci username"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input-glass"
					placeholder="Inserisci password"
				/>
			</div>

			<button type="submit" class="btn-primary w-full">
				Accedi
			</button>
		</form>
		
		<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
			Non hai un account? 
			<a href="/register" class="font-semibold text-blue-600 hover:text-purple-600 dark:text-blue-400 dark:hover:text-purple-400 transition-colors">
				Registrati
			</a>
		</p>
	</div>

	<!-- Decorative blobs -->
	<div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
		<div class="absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl"></div>
		<div class="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl"></div>
	</div>
</div>
