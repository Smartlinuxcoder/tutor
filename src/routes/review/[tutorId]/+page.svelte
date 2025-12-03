<script>
	let { data, form } = $props();
	let selectedRating = $state(0);

	const getEmoji = (rating) => {
		switch(rating) {
			case 1: return '😑';
			case 2: return '😐';
			case 3: return '😉';
			case 4: return '😌';
			case 5: return '🤩';
			default: return '';
		}
	};
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="glass-card w-full max-w-md rounded-md p-8">
		<h2 class="mb-2 text-center text-2xl font-bold" style="color: var(--text-primary);">Lascia un Feedback</h2>
		<p class="mb-6 text-center" style="color: var(--text-secondary);">per {data.tutor.fullName}</p>

		{#if form?.success}
			<div class="mb-4 rounded-md bg-green-500/20 border border-green-500/30 p-4 text-center text-green-400">
				Grazie per il tuo feedback!
			</div>
		{:else}
			{#if form?.error}
				<div class="mb-4 rounded-md bg-red-500/20 border border-red-500/30 p-3 text-red-400">
					{form.error}
				</div>
			{/if}

			<form method="POST" class="space-y-4">
				<div>
					<label for="rating" class="block text-sm font-medium" style="color: var(--text-secondary);">Voto (1-5)</label>
					<div class="mt-2 flex justify-center space-x-2">
						{#each [1, 2, 3, 4, 5] as star}
							<label class="cursor-pointer">
								<input 
									type="radio" 
									name="rating" 
									value={star} 
									class="sr-only" 
									required 
									onchange={() => selectedRating = star}
								/>
								<span 
									class="text-4xl transition-all duration-200 hover:scale-110 inline-block"
									style="color: {selectedRating >= star ? '#facc15' : 'var(--text-muted)'};"
								>★</span>
							</label>
						{/each}
					</div>
					<!-- Emoji dinamica -->
					{#if selectedRating > 0}
						<div class="mt-3 text-center text-5xl animate-bounce">
							{getEmoji(selectedRating)}
						</div>
					{/if}
				</div>

				<div>
					<label for="comment" class="block text-sm font-medium" style="color: var(--text-secondary);">Commento (opzionale)</label>
					<textarea
						id="comment"
						name="comment"
						rows="3"
						class="input-glass mt-1 block w-full rounded-md p-2.5"
					></textarea>
				</div>

				<button
					type="submit"
					class="btn-primary w-full rounded-md px-4 py-2.5 font-semibold"
				>
					Invia Feedback
				</button>
			</form>
		{/if}
	</div>
</div>
