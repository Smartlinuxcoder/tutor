<script>
	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="glass-card w-full max-w-md rounded-md p-8">
		<h2 class="mb-6 text-center text-2xl font-bold" style="color: var(--text-primary);">Registrazione</h2>

		{#if form?.error}
			<div class="mb-4 rounded-md bg-red-500/20 border border-red-500/30 p-3 text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="fullName" class="block text-sm font-medium" style="color: var(--text-secondary);">Nome Completo</label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					required
					class="input-glass mt-1 block w-full rounded-md p-2.5"
				/>
			</div>

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

			<div>
				<label for="role" class="block text-sm font-medium" style="color: var(--text-secondary);">Ruolo</label>
				<select
					id="role"
					name="role"
					class="input-glass mt-1 block w-full rounded-md p-2.5"
					onchange={(e) => {
						const secretField = document.getElementById('secret-field');
						const subjectField = document.getElementById('subject-field');
						if (e.target.value === 'professor') {
							secretField.classList.remove('hidden');
							subjectField.classList.add('hidden');
						} else {
							secretField.classList.add('hidden');
							subjectField.classList.remove('hidden');
						}
					}}
				>
					<option value="tutor">Tutor</option>
					<option value="professor">Professore</option>
				</select>
			</div>

			<div id="subject-field">
				<label for="subject" class="block text-sm font-medium" style="color: var(--text-secondary);">Materia (solo per Tutor)</label>
				<input
					type="text"
					id="subject"
					name="subject"
					class="input-glass mt-1 block w-full rounded-md p-2.5"
				/>
			</div>

			<div id="secret-field" class="hidden">
				<label for="secret" class="block text-sm font-medium" style="color: var(--text-secondary);">Codice Segreto (solo per Professori)</label>
				<input
					type="password"
					id="secret"
					name="secret"
					class="input-glass mt-1 block w-full rounded-md p-2.5"
				/>
			</div>

			<!-- Privacy Checkbox -->
			<div class="flex items-start gap-3">
				<input
					type="checkbox"
					id="privacyAccept"
					name="privacyAccept"
					required
					class="mt-1 h-4 w-4 rounded border-2 accent-[var(--accent)]"
				/>
				<label for="privacyAccept" class="text-sm" style="color: var(--text-secondary);">
					I dati nelle aree riservate di questo sito sono confidenziali, non li utilizzerò al di fuori del loro scopo.
				</label>
			</div>

			<button
				type="submit"
				class="btn-primary w-full rounded-md px-4 py-2.5 font-semibold"
			>
				Registrati
			</button>
		</form>
		<p class="mt-4 text-center text-sm" style="color: var(--text-muted);">
			Hai già un account? <a href="/login" class="font-medium hover:underline" style="color: var(--accent);">Accedi</a>
		</p>
	</div>
</div>
