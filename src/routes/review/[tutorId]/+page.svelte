<script>
	let { data, form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-2 text-center text-2xl font-bold text-gray-800">Lascia una Recensione</h2>
		<p class="mb-6 text-center text-gray-600">per {data.tutor.fullName}</p>

		{#if form?.success}
			<div class="mb-4 rounded bg-green-100 p-4 text-center text-green-700">
				Grazie per la tua recensione!
			</div>
		{:else}
			{#if form?.error}
				<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
					{form.error}
				</div>
			{/if}

			<form method="POST" class="space-y-4">
				<div>
					<label for="rating" class="block text-sm font-medium text-gray-700">Voto (1-5)</label>
					<div class="mt-1 flex justify-center space-x-4">
						{#each [1, 2, 3, 4, 5] as star}
							<label class="cursor-pointer">
								<input type="radio" name="rating" value={star} class="peer sr-only" required />
								<span class="text-3xl text-gray-300 peer-checked:text-yellow-500 hover:text-yellow-400"
									>★</span
								>
							</label>
						{/each}
					</div>
				</div>

				<div>
					<label for="comment" class="block text-sm font-medium text-gray-700"
						>Commento (opzionale)</label
					>
					<textarea
						id="comment"
						name="comment"
						rows="3"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Invia Recensione
				</button>
			</form>
		{/if}
	</div>
</div>
