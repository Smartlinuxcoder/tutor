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
		
		// Scambia le dimensioni
		tempCanvas.width = canvas.height;
		tempCanvas.height = canvas.width;
		
		// Trasla e ruota
		ctx.translate(0, canvas.width);
		ctx.rotate(-Math.PI / 2);
		
		// Disegna l'immagine originale
		ctx.drawImage(canvas, 0, 0);
		return tempCanvas.toDataURL();
	};

	const toggleFullScreen = () => {
		if (isFullScreen) {
			// Uscita da schermo intero: cattura e ruota se c'è una firma
			if (!signaturePad.isEmpty()) {
				capturedSignature = getRotatedSignature();
				signaturePad.clear();
			}
		} else {
			// Ingresso a schermo intero: pulisce tutto per nuova firma
			capturedSignature = null;
			signaturePad.clear();
		}
		
		isFullScreen = !isFullScreen;
		// Wait for the DOM to update classes before resizing
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

<div class="min-h-screen bg-gray-100 p-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold text-gray-800">Registro Lezioni</h1>
			<a href="/dashboard" class="text-blue-600 hover:underline">Torna alla Dashboard</a>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- Form Section -->
			<div class="rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Nuova Lezione</h2>
				
				{#if form?.success}
					<div class="mb-4 rounded bg-green-100 p-4 text-center text-green-700">
						Lezione registrata con successo!
					</div>
				{/if}

				{#if form?.error}
					<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
						{form.error}
					</div>
				{/if}

				<form method="POST" class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="studentFirstName" class="block text-sm font-medium text-gray-700">Nome</label>
							<input
								type="text"
								id="studentFirstName"
								name="studentFirstName"
								required
								class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label for="studentLastName" class="block text-sm font-medium text-gray-700">Cognome</label>
							<input
								type="text"
								id="studentLastName"
								name="studentLastName"
								required
								class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label for="studentClass" class="block text-sm font-medium text-gray-700">Classe</label>
						<input
							type="text"
							id="studentClass"
							name="studentClass"
							required
							class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label for="topicsCovered" class="block text-sm font-medium text-gray-700">Argomenti Svolti</label>
						<textarea
							id="topicsCovered"
							name="topicsCovered"
							rows="3"
							required
							class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						></textarea>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700">Firma dello Studente</label>
						<div 
							class={isFullScreen 
								? "fixed inset-0 z-50 flex flex-col bg-white p-4" 
								: "mt-1 rounded-md border border-gray-300 bg-gray-50 relative"}
						>
							{#if isFullScreen}
								<div class="mb-4 flex justify-between items-center relative z-10">
									<h3 class="text-lg font-bold">Firma a Schermo Intero</h3>
									<button 
										type="button" 
										onclick={toggleFullScreen}
										class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
									>
										Fatto
									</button>
								</div>
								
								<!-- Sfondo con testo verticale per orientamento -->
								<div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
									<h1 class="text-6xl font-bold rotate-90 whitespace-nowrap transform text-gray-800">
										Firma qui 
									</h1>
								</div>
							{/if}
							
							<canvas 
								bind:this={canvas} 
								class={isFullScreen ? "flex-grow w-full border border-gray-300 touch-none relative z-10" : "h-40 w-full touch-none"}
							></canvas>

							{#if capturedSignature && !isFullScreen}
								<img 
									src={capturedSignature} 
									alt="Firma acquisita" 
									class="absolute inset-0 h-full w-full object-contain bg-white pointer-events-none" 
								/>
							{/if}
							
							{#if !isFullScreen && !capturedSignature}
								<button
									type="button"
									onclick={toggleFullScreen}
									class="absolute top-2 right-2 rounded bg-gray-200 p-1 text-xs hover:bg-gray-300"
									>
										⤢
								</button>
							{/if}
						</div>
						
						<div class="mt-2 flex justify-between">
							<button
								type="button"
								onclick={clearSignature}
								class="text-sm text-red-600 hover:underline"
							>
								Pulisci Firma
							</button>
							{#if !isFullScreen}
								<button
									type="button"
									onclick={toggleFullScreen}
									class="text-sm text-blue-600 hover:underline"
								>
									Firma a schermo intero
								</button>
							{/if}
						</div>
						<input type="hidden" id="signatureData" name="signatureData" />
					</div>

					<button
						type="submit"
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Registra Lezione
					</button>
				</form>
			</div>

			<!-- History Section -->
			<div class="rounded-lg bg-white p-8 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Storico Lezioni</h2>
				{#if data.entries.length === 0}
					<p class="text-gray-500">Nessuna lezione registrata.</p>
				{:else}
					<div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
						{#each data.entries as entry}
							<div class="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
								<div class="flex justify-between items-start">
									<div>
										<p class="font-bold text-gray-800">{entry.studentFirstName} {entry.studentLastName}</p>
										<p class="text-sm text-gray-600">Classe: {entry.studentClass}</p>
										<p class="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString('it-IT')}</p>
									</div>
									<img src={entry.signatureData} alt="Firma" class="h-8 border border-gray-200" />
								</div>
								<p class="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">{entry.topicsCovered}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
