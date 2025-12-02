<script>
	let { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Registrazione</h2>

		{#if form?.error}
			<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700">Nome Completo</label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="role" class="block text-sm font-medium text-gray-700">Ruolo</label>
				<select
					id="role"
					name="role"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
				<label for="subject" class="block text-sm font-medium text-gray-700">Materia (solo per Tutor)</label>
				<input
					type="text"
					id="subject"
					name="subject"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div id="secret-field" class="hidden">
				<label for="secret" class="block text-sm font-medium text-gray-700"
					>Codice Segreto (solo per Professori)</label
				>
				<input
					type="password"
					id="secret"
					name="secret"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Registrati
			</button>
		</form>
		<p class="mt-4 text-center text-sm text-gray-600">
			Hai già un account? <a href="/login" class="text-blue-600 hover:underline">Accedi</a>
		</p>
	</div>
</div>
