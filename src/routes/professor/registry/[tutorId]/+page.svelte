<script>
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';

	let { data } = $props();

	const downloadRegistryPdf = () => {
		const doc = new jsPDF();
		
		doc.setFontSize(18);
		doc.text(`Registro Lezioni: ${data.tutor.fullName}`, 14, 15);

		doc.setFontSize(12);
		doc.setTextColor(100);
		doc.text(`Email: ${data.tutor.username}`, 14, 22);
		doc.text(`Materia: ${data.tutor.subject || 'Non specificata'}`, 14, 29);
		doc.text(`Lezioni Svolte: ${data.entries.length}`, 14, 36);
		doc.setTextColor(0);

		const tableData = data.entries.map(entry => [
			new Date(entry.date).toLocaleDateString('it-IT'),
			`${entry.studentFirstName} ${entry.studentLastName}`,
			entry.studentClass,
			entry.topicsCovered,
			entry.signatureData
		]);

		autoTable(doc, {
			head: [['Data', 'Studente', 'Classe', 'Argomenti', 'Firma']],
			body: tableData,
			startY: 42,
			bodyStyles: { minCellHeight: 15, valign: 'middle' },
			didParseCell: (data) => {
				if (data.section === 'body' && data.column.index === 4) {
					data.cell.text = '';
				}
			},
			didDrawCell: (data) => {
				if (data.section === 'body' && data.column.index === 4 && data.cell.raw) {
					try {
						doc.addImage(data.cell.raw, 'PNG', data.cell.x + 2, data.cell.y + 2, 20, 10);
					} catch (e) {
						console.error('Error adding signature image', e);
					}
				}
			},
			columnStyles: {
				4: { cellWidth: 25 }
			}
		});

		doc.save(`registro-${data.tutor.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
	};

	const downloadFeedbackPdf = () => {
		const doc = new jsPDF();
		doc.text(`Feedback: ${data.tutor.fullName}`, 14, 15);

		const tableData = data.reviews.map(review => [
			new Date(review.createdAt).toLocaleDateString('it-IT'),
			review.rating,
			review.comment || ''
		]);

		autoTable(doc, {
			head: [['Data', 'Voto', 'Commento']],
			body: tableData,
			startY: 20
		});

		doc.save(`feedback-${data.tutor.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
	};
</script>

<div class="min-h-screen p-8">
	<div class="mx-auto max-w-6xl">
		<header class="glass-card mb-8 flex items-center justify-between rounded-md p-6">
			<div>
				<h1 class="text-3xl font-bold" style="color: var(--text-primary);">Registro Lezioni: {data.tutor.fullName}</h1>
				<p style="color: var(--text-secondary);">Materia: {data.tutor.subject || 'Non specificata'}</p>
			</div>
			<div class="flex items-center gap-4">
				<button
					onclick={downloadRegistryPdf}
					class="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-500 transition-all"
				>
					Scarica Registro
				</button>
				<button
					onclick={downloadFeedbackPdf}
					class="btn-primary rounded-md px-3 py-1.5 text-sm"
				>
					Scarica Feedback
				</button>
				<a href="/professor" class="hover:underline" style="color: var(--accent);">Torna alla Dashboard</a>
			</div>
		</header>

		<div class="glass-card rounded-md p-6">
			{#if data.entries.length === 0}
				<p class="text-center" style="color: var(--text-muted);">Nessuna lezione registrata per questo tutor.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y" style="border-color: var(--glass-border);">
						<thead>
							<tr style="background: var(--glass-bg);">
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">
									Data
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">
									Studente
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">
									Classe
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">
									Argomenti
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-muted);">
									Firma
								</th>
							</tr>
						</thead>
						<tbody class="divide-y" style="border-color: var(--glass-border);">
							{#each data.entries as entry}
								<tr>
									<td class="whitespace-nowrap px-6 py-4 text-sm" style="color: var(--text-muted);">
										{new Date(entry.date).toLocaleDateString('it-IT')}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm font-medium" style="color: var(--text-primary);">
										{entry.studentFirstName} {entry.studentLastName}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm" style="color: var(--text-muted);">
										{entry.studentClass}
									</td>
									<td class="px-6 py-4 text-sm" style="color: var(--text-secondary);">
										{entry.topicsCovered}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm">
										<img src={entry.signatureData} alt="Firma" class="h-12 rounded-md" style="border: 1px solid var(--glass-border);" />
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>
