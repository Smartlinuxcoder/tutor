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

<div class="min-h-screen bg-gray-100 p-8">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">Dashboard Tutor</h1>
				<p class="text-gray-600">Benvenuto, {data.user.fullName}</p>
			</div>
			<div class="text-right">
				<form action="/logout" method="POST" class="inline-block">
					<button type="submit" class="text-red-600 hover:underline">Esci</button>
				</form>
			</div>
		</header>

		<div class="mb-8 flex justify-end">
			<a
				href="/registry"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Vai al Registro Lezioni
			</a>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Stats Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Le tue Statistiche</h2>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500">Media Voti</p>
						<p class="text-4xl font-bold text-blue-600">{data.averageRating}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Recensioni Totali</p>
						<p class="text-4xl font-bold text-blue-600">{data.reviews.length}</p>
					</div>
				</div>
			</div>

			<!-- QR Code Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Il tuo QR Code</h2>
				<div class="flex flex-col items-center">
					{#if qrCodeUrl}
						<img src={qrCodeUrl} alt="QR Code" class="mb-4 h-32 w-32" />
					{:else}
						<div class="mb-4 flex h-32 w-32 items-center justify-center bg-gray-200 text-gray-500">
							Caricamento...
						</div>
					{/if}
					<button
						onclick={downloadPdf}
						class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Scarica PDF
					</button>
				</div>
			</div>
		</div>

		<!-- Reviews List -->
		<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-6 text-xl font-semibold text-gray-800">Recensioni Recenti</h2>
			{#if data.reviews.length === 0}
				<p class="text-gray-500">Nessuna recensione ancora.</p>
			{:else}
				<div class="space-y-4">
					{#each data.reviews as review}
						<div class="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span class="mr-2 text-lg font-bold text-yellow-500">
										{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
									</span>
									<span class="text-sm text-gray-500">
										{new Date(review.createdAt).toLocaleDateString('it-IT')}
									</span>
								</div>
							</div>
							{#if review.comment}
								<p class="mt-2 text-gray-700">{review.comment}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
