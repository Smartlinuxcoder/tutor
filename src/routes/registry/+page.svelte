<script>
	import { onMount } from 'svelte';
	import SignaturePad from 'signature_pad';

	let { data, form } = $props();
	let signaturePad;
	let canvas;
	let isFullScreen = $state(false);
	let capturedSignature = $state(null);

	const resizeCanvas = () => {
		if (!canvas || !signaturePad) return;
		const data = signaturePad.toData();
		const ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext('2d').scale(ratio, ratio);
		signaturePad.clear();
		signaturePad.fromData(data);
	};

	onMount(() => {
		signaturePad = new SignaturePad(canvas);
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		return () => window.removeEventListener('resize', resizeCanvas);
	});

	const clearSignature = () => {
		signaturePad.clear();
		capturedSignature = null;
	};

	const getRotatedSignature = () => {
		const tempCanvas = document.createElement('canvas');
		const ctx = tempCanvas.getContext('2d');
		
		tempCanvas.width = canvas.height;
		tempCanvas.height = canvas.width;
		
		ctx.translate(0, canvas.width);
		ctx.rotate(-Math.PI / 2);
		
		ctx.drawImage(canvas, 0, 0);
		return tempCanvas.toDataURL();
	};

	const toggleFullScreen = () => {
		if (isFullScreen) {
			if (!signaturePad.isEmpty()) {
				capturedSignature = getRotatedSignature();
				signaturePad.clear();
			}
		} else {
			capturedSignature = null;
			signaturePad.clear();
		}
		
		isFullScreen = !isFullScreen;
		setTimeout(resizeCanvas, 50);
	};

	const handleSubmit = (e) => {
		let data;
		
		if (capturedSignature) {
			data = capturedSignature;
		} else {
			if (signaturePad.isEmpty()) {
				e.preventDefault();
				alert('Per favore, firma prima di inviare.');
				return;
			}
			data = signaturePad.toDataURL();
		}

		document.getElementById('signatureData').value = data;
	};
</script>

<div class="min-h-screen p-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold" style="color: var(--text-primary);">Registro Lezioni</h1>
			<a href="/dashboard" class="hover:underline" style="color: var(--accent);">Torna alla Dashboard</a>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- Form Section -->
			<div class="glass-card rounded-md p-8">
				<h2 class="mb-4 text-xl font-semibold" style="color: var(--text-primary);">Nuova Lezione</h2>
				
				{#if form?.success}
					<div class="mb-4 rounded-md bg-green-500/20 border border-green-500/30 p-4 text-center text-green-400">
						Lezione registrata con successo!
					</div>
				{/if}

				{#if form?.error}
					<div class="mb-4 rounded-md bg-red-500/20 border border-red-500/30 p-3 text-red-400">
						{form.error}
					</div>
				{/if}

				<form method="POST" class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="studentFirstName" class="block text-sm font-medium" style="color: var(--text-secondary);">Nome</label>
							<input
								type="text"
								id="studentFirstName"
								name="studentFirstName"
								required
								class="input-glass mt-1 block w-full rounded-md p-2.5"
							/>
						</div>
						<div>
							<label for="studentLastName" class="block text-sm font-medium" style="color: var(--text-secondary);">Cognome</label>
							<input
								type="text"
								id="studentLastName"
								name="studentLastName"
								required
								class="input-glass mt-1 block w-full rounded-md p-2.5"
							/>
						</div>
					</div>

					<div>
						<label for="studentClass" class="block text-sm font-medium" style="color: var(--text-secondary);">Classe</label>
						<input
							type="text"
							id="studentClass"
							name="studentClass"
							required
							class="input-glass mt-1 block w-full rounded-md p-2.5"
						/>
					</div>

					<div>
						<label for="topicsCovered" class="block text-sm font-medium" style="color: var(--text-secondary);">Argomenti Svolti</label>
						<textarea
							id="topicsCovered"
							name="topicsCovered"
							rows="3"
							required
							class="input-glass mt-1 block w-full rounded-md p-2.5"
						></textarea>
					</div>

					<div>
						<label class="block text-sm font-medium" style="color: var(--text-secondary);">Firma dello Studente</label>
						<div 
							class={isFullScreen 
								? "fixed inset-0 z-50 flex flex-col p-4" 
								: "mt-1 rounded-md relative"}
							style={isFullScreen ? "background: var(--bg-primary);" : "background: var(--glass-bg); border: 1px solid var(--glass-border);"}
						>
							{#if isFullScreen}
								<div class="mb-4 flex justify-between items-center relative z-10">
									<h3 class="text-lg font-bold" style="color: var(--text-primary);">Firma a Schermo Intero</h3>
									<button 
										type="button" 
										onclick={toggleFullScreen}
										class="btn-primary rounded-md px-4 py-2"
									>
										Fatto
									</button>
								</div>
								
								<div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
									<h1 class="text-6xl font-bold rotate-90 whitespace-nowrap transform" style="color: var(--text-primary);">
										Firma qui 
									</h1>
								</div>
							{/if}
							
							<canvas 
								bind:this={canvas} 
								class={isFullScreen ? "flex-grow w-full rounded-md touch-none relative z-10" : "h-40 w-full touch-none"}
								style="border: 1px solid var(--glass-border);"
							></canvas>

							{#if capturedSignature && !isFullScreen}
								<img 
									src={capturedSignature} 
									alt="Firma acquisita" 
									class="absolute inset-0 h-full w-full object-contain pointer-events-none rounded-md" 
									style="background: var(--glass-bg);"
								/>
							{/if}
							
							{#if !isFullScreen && !capturedSignature}
								<button
									type="button"
									onclick={toggleFullScreen}
									class="absolute top-2 right-2 rounded-md p-1 text-xs transition-all" 
									style="background: var(--glass-bg); color: var(--text-secondary);"
								>
									⤢
								</button>
							{/if}
						</div>
						
						<div class="mt-2 flex justify-between">
							<button
								type="button"
								onclick={clearSignature}
								class="text-sm text-red-400 hover:underline"
							>
								Pulisci Firma
							</button>
							{#if !isFullScreen}
								<button
									type="button"
									onclick={toggleFullScreen}
									class="text-sm hover:underline"
									style="color: var(--accent);"
								>
									Firma a schermo intero
								</button>
							{/if}
						</div>
						<input type="hidden" id="signatureData" name="signatureData" />
					</div>

					<button
						type="submit"
						class="btn-primary w-full rounded-md px-4 py-2.5 font-semibold"
					>
						Registra Lezione
					</button>
				</form>
			</div>

			<!-- History Section -->
			<div class="glass-card rounded-md p-8">
				<h2 class="mb-4 text-xl font-semibold" style="color: var(--text-primary);">Storico Lezioni</h2>
				{#if data.entries.length === 0}
					<p style="color: var(--text-muted);">Nessuna lezione registrata.</p>
				{:else}
					<div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
						{#each data.entries as entry}
							<div class="border-b pb-4 last:border-0 last:pb-0" style="border-color: var(--glass-border);">
								<div class="flex justify-between items-start">
									<div>
										<p class="font-bold" style="color: var(--text-primary);">{entry.studentFirstName} {entry.studentLastName}</p>
										<p class="text-sm" style="color: var(--text-secondary);">Classe: {entry.studentClass}</p>
										<p class="text-xs" style="color: var(--text-muted);">{new Date(entry.date).toLocaleDateString('it-IT')}</p>
									</div>
									<img src={entry.signatureData} alt="Firma" class="h-8 rounded-md" style="border: 1px solid var(--glass-border);" />
								</div>
								<p class="mt-2 text-sm p-2 rounded-md" style="color: var(--text-secondary); background: var(--glass-bg);">{entry.topicsCovered}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
