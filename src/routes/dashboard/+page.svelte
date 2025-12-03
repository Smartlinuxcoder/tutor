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
		doc.text('Lascia un feedback!', 105, 20, { align: 'center' });
		
		doc.setFontSize(16);
		doc.text(`Tutor: ${data.user.fullName}`, 105, 30, { align: 'center' });

		if (qrCodeUrl) {
			doc.addImage(qrCodeUrl, 'PNG', 55, 40, 100, 100);
		}

		doc.setFontSize(12);
		doc.text('Scansiona il QR code per lasciare un feedback.', 105, 150, { align: 'center' });
		doc.text(data.reviewLink, 105, 160, { align: 'center' });

		doc.save('feedback-tutor.pdf');
	};
</script>

<div class="min-h-screen p-8">
	<div class="mx-auto max-w-4xl">
		<header class="glass-card mb-8 flex items-center justify-between rounded-md p-6">
			<div>
				<h1 class="text-3xl font-bold" style="color: var(--text-primary);">Dashboard Tutor</h1>
				<p style="color: var(--text-secondary);">Benvenuto, {data.user.fullName}</p>
			</div>
			<div class="text-right">
				<form action="/logout" method="POST" class="inline-block">
					<button type="submit" class="text-red-400 hover:text-red-300 hover:underline">Esci</button>
				</form>
			</div>
		</header>

		<div class="mb-8 flex justify-end">
			<a
				href="/registry"
				class="btn-primary rounded-md px-4 py-2"
			>
				Vai al Registro Lezioni
			</a>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Stats Card -->
			<div class="glass-card rounded-md p-6">
				<h2 class="mb-4 text-xl font-semibold" style="color: var(--text-primary);">Le tue Statistiche</h2>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm" style="color: var(--text-muted);">Media Voti</p>
						<p class="text-4xl font-bold" style="color: var(--accent);">{data.averageRating}</p>
					</div>
					<div>
						<p class="text-sm" style="color: var(--text-muted);">Feedback Totali</p>
						<p class="text-4xl font-bold" style="color: var(--accent);">{data.reviews.length}</p>
					</div>
				</div>
			</div>

			<!-- QR Code Card -->
			<div class="glass-card rounded-md p-6">
				<h2 class="mb-4 text-xl font-semibold" style="color: var(--text-primary);">Il tuo QR Code</h2>
				<div class="flex flex-col items-center">
					{#if qrCodeUrl}
						<img src={qrCodeUrl} alt="QR Code" class="mb-4 h-32 w-32 rounded-md" />
					{:else}
						<div class="mb-4 flex h-32 w-32 items-center justify-center rounded-md" style="background: var(--glass-bg); color: var(--text-muted);">
							Caricamento...
						</div>
					{/if}
					<button
						onclick={downloadPdf}
						class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500 transition-all"
					>
						Scarica PDF
					</button>
				</div>
			</div>
		</div>

			<!-- Feedback List -->
		<div class="glass-card mt-8 rounded-md p-6">
			<h2 class="mb-6 text-xl font-semibold" style="color: var(--text-primary);">Feedback Recenti</h2>
			{#if data.reviews.length === 0}
				<p style="color: var(--text-muted);">Nessun feedback ancora.</p>
			{:else}
				<div class="space-y-4">
					{#each data.reviews as review}
						<div class="border-b pb-4 last:border-0 last:pb-0" style="border-color: var(--glass-border);">
							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<span class="mr-2 text-lg font-bold text-yellow-500">
										{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
									</span>
									<span class="text-sm" style="color: var(--text-muted);">
										{new Date(review.createdAt).toLocaleDateString('it-IT')}
									</span>
								</div>
							</div>
							{#if review.comment}
								<p class="mt-2" style="color: var(--text-secondary);">{review.comment}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
