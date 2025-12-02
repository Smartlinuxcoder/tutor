<script>
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';

	let { data } = $props();

	const downloadRegistryPdf = () => {
		const doc = new jsPDF();
		
		// Header Info
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

	const downloadReviewsPdf = () => {
		const doc = new jsPDF();
		doc.text(`Recensioni: ${data.tutor.fullName}`, 14, 15);

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

		doc.save(`recensioni-${data.tutor.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
	};
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">Registro Lezioni: {data.tutor.fullName}</h1>
				<p class="text-gray-600">Materia: {data.tutor.subject || 'Non specificata'}</p>
			</div>
			<div class="flex items-center gap-4">
				<button
					onclick={downloadRegistryPdf}
					class="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
				>
					Scarica Registro
				</button>
				<button
					onclick={downloadReviewsPdf}
					class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
				>
					Scarica Recensioni
				</button>
				<a href="/professor" class="text-blue-600 hover:underline">Torna alla Dashboard</a>
			</div>
		</header>

		<div class="rounded-lg bg-white p-6 shadow-md">
			{#if data.entries.length === 0}
				<p class="text-center text-gray-500">Nessuna lezione registrata per questo tutor.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Data
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Studente
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Classe
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Argomenti
								</th>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
								>
									Firma
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.entries as entry}
								<tr>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										{new Date(entry.date).toLocaleDateString('it-IT')}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
										{entry.studentFirstName} {entry.studentLastName}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										{entry.studentClass}
									</td>
									<td class="px-6 py-4 text-sm text-gray-500">
										{entry.topicsCovered}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										<img src={entry.signatureData} alt="Firma" class="h-12 border border-gray-200" />
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
