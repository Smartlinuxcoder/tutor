<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { jsPDF } from 'jspdf';

	let { data } = $props();
	let qrCodeUrl = $state('');

	onMount(async () => {
		try {
			qrCodeUrl = await QRCode.toDataURL(data.reviewLink);
		} catch (err) {
			console.error(err);
		}
	});

	const downloadPdf = () => {
		const doc = new jsPDF();
		doc.setFontSize(22);
		doc.text('Lascia una recensione!', 105, 20, { align: 'center' });
		
		doc.setFontSize(16);
		doc.text(`Tutor: ${data.user.fullName}`, 105, 30, { align: 'center' });

		if (qrCodeUrl) {
			doc.addImage(qrCodeUrl, 'PNG', 55, 40, 100, 100);
		}

		doc.setFontSize(12);
		doc.text('Scansiona il QR code per lasciare una recensione.', 105, 150, { align: 'center' });
		doc.text(data.reviewLink, 105, 160, { align: 'center' });

		doc.save('recensione-tutor.pdf');
	};
</script>

<div class="min-h-screen p-8">
	<div class="mx-auto max-w-4xl">
		<header class="glass-card mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div>
				<h1 class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
					Dashboard Tutor
				</h1>
				<p class="text-gray-600 dark:text-gray-400">Benvenuto, {data.user.fullName}</p>
			</div>
			<div class="text-right">
				<form action="/logout" method="POST" class="inline-block">
					<button type="submit" class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors">
						Esci
					</button>
				</form>
			</div>
		</header>

		<div class="mb-8 flex justify-end">
			<a href="/registry" class="btn-primary">
				<svg class="mr-2 inline-block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				Vai al Registro Lezioni
			</a>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Stats Card -->
			<div class="glass-card bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
				<h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Le tue Statistiche</h2>
				<div class="flex items-center justify-around">
					<div class="text-center">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Media Voti</p>
						<p class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{data.averageRating}
						</p>
					</div>
					<div class="h-16 w-px bg-gray-300 dark:bg-gray-600"></div>
					<div class="text-center">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Recensioni Totali</p>
						<p class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
							{data.reviews.length}
						</p>
					</div>
				</div>
			</div>

			<!-- QR Code Card -->
			<div class="glass-card bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10">
				<h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Il tuo QR Code</h2>
				<div class="flex flex-col items-center">
					{#if qrCodeUrl}
						<div class="glass rounded-lg p-4 mb-4">
							<img src={qrCodeUrl} alt="QR Code" class="h-32 w-32" />
						</div>
					{:else}
						<div class="mb-4 flex h-40 w-40 items-center justify-center glass rounded-lg">
							<div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
						</div>
					{/if}
					<button onclick={downloadPdf} class="btn-primary">
						<svg class="mr-2 inline-block h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						Scarica PDF
					</button>
				</div>
			</div>
		</div>

		<!-- Reviews List -->
		<div class="glass-card mt-8">
			<h2 class="mb-6 text-xl font-semibold text-gray-800 dark:text-gray-200">Recensioni Recenti</h2>
			{#if data.reviews.length === 0}
				<div class="text-center py-8">
					<svg class="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
					</svg>
					<p class="text-gray-500 dark:text-gray-400">Nessuna recensione ancora.</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.reviews as review}
						<div class="glass rounded-lg p-4 border-l-4 border-blue-500 dark:border-purple-500">
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-2">
									<span class="text-2xl">
										{'⭐'.repeat(review.rating)}
									</span>
								</div>
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{new Date(review.createdAt).toLocaleDateString('it-IT')}
								</span>
							</div>
							{#if review.comment}
								<p class="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
