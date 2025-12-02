<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';

	let { data } = $props();
	let generalChartCanvas;
	let tutorCharts = {};

	const downloadAllRegistriesPdf = () => {
		const doc = new jsPDF();

		data.tutors.forEach((tutor, index) => {
			if (index > 0) {
				doc.addPage();
			}

			// Header Info
			doc.setFontSize(18);
			doc.text(`Registro Lezioni: ${tutor.fullName}`, 14, 15);

			doc.setFontSize(12);
			doc.setTextColor(100);
			doc.text(`Email: ${tutor.username}`, 14, 22);
			doc.text(`Materia: ${tutor.subject || 'Non specificata'}`, 14, 29);

			const tutorEntries = data.allRegistryEntries.filter((e) => e.tutorId === tutor.id);
			doc.text(`Lezioni Svolte: ${tutorEntries.length}`, 14, 36);
			doc.setTextColor(0);

			const tableData = tutorEntries.map((entry) => [
				new Date(entry.date).toLocaleDateString('it-IT'),
				`${entry.studentFirstName} ${entry.studentLastName}`,
				entry.studentClass,
				entry.topicsCovered,
				entry.signatureData
			]);

			autoTable(doc, {
				startY: 42,
				head: [['Data', 'Studente', 'Classe', 'Argomenti', 'Firma']],
				body: tableData,
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
		});

		doc.save('registro-completo-lezioni.pdf');
	};

	const downloadAllReviewsPdf = () => {
		const doc = new jsPDF();
		doc.text('Recensioni Complete Tutor', 14, 15);

		const tableData = data.allReviews.map(review => {
			const tutor = data.tutors.find(t => t.id === review.tutorId);
			return [
				new Date(review.createdAt).toLocaleDateString('it-IT'),
				tutor ? tutor.fullName : 'N/A',
				review.rating,
				review.comment || ''
			];
		});

		autoTable(doc, {
			head: [['Data', 'Tutor', 'Voto', 'Commento']],
			body: tableData,
			startY: 20
		});

		doc.save('recensioni-complete.pdf');
	};

	onMount(() => {
		// General Chart: Average Rating per Tutor
		const ctx = generalChartCanvas.getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: data.tutors.map((t) => t.fullName),
				datasets: [
					{
						label: 'Media Voti',
						data: data.tutors.map((t) => t.averageRating),
						backgroundColor: 'rgba(59, 130, 246, 0.5)',
						borderColor: 'rgb(59, 130, 246)',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						max: 5
					}
				}
			}
		});

		// Per-Tutor Charts: Rating Distribution
		data.tutors.forEach((tutor) => {
			if (tutorCharts[tutor.id]) {
				const ctxTutor = tutorCharts[tutor.id].getContext('2d');
				
				// Calculate distribution
				const distribution = [0, 0, 0, 0, 0]; // 1 to 5 stars
				tutor.reviews.forEach(r => {
					if (r.rating >= 1 && r.rating <= 5) {
						distribution[r.rating - 1]++;
					}
				});

				new Chart(ctxTutor, {
					type: 'doughnut',
					data: {
						labels: ['1 Stella', '2 Stelle', '3 Stelle', '4 Stelle', '5 Stelle'],
						datasets: [{
							data: distribution,
							backgroundColor: [
								'#ef4444', // Red
								'#f97316', // Orange
								'#eab308', // Yellow
								'#84cc16', // Lime
								'#22c55e'  // Green
							]
						}]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: 'right',
								labels: {
									boxWidth: 10
								}
							}
						}
					}
				});
			}
		});
	});
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
			<div>
				<h1 class="text-3xl font-bold text-gray-800">Dashboard Professore</h1>
				<p class="text-gray-600">Benvenuto, {data.user.fullName}</p>
			</div>
			<div class="text-right">
				<form action="/logout" method="POST">
					<button type="submit" class="text-red-600 hover:underline">Esci</button>
				</form>
			</div>
		</header>

		<!-- General Stats -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-gray-800">Panoramica Tutor</h2>
				<div class="space-x-2">
					<button
						onclick={downloadAllRegistriesPdf}
						class="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
					>
						Scarica Tutti i Registri
					</button>
					<button
						onclick={downloadAllReviewsPdf}
						class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
					>
						Scarica Tutte le Recensioni
					</button>
				</div>
			</div>
			<div class="h-64 w-full">
				<canvas bind:this={generalChartCanvas}></canvas>
			</div>
		</div>

		<!-- Tutors List -->
		<h2 class="mb-6 text-2xl font-bold text-gray-800">Dettaglio Tutor</h2>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.tutors as tutor}
				<div class="rounded-lg bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-bold text-gray-800">{tutor.fullName}</h3>
						<span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
							{tutor.averageRating} / 5
						</span>
					</div>
					
					<p class="mb-4 text-sm text-gray-600">
						Recensioni totali: <span class="font-semibold">{tutor.reviewCount}</span>
					</p>

					<div class="mb-4 text-center">
						<a
							href={`/professor/registry/${tutor.id}`}
							class="text-sm font-medium text-blue-600 hover:underline"
						>
							Visualizza Registro Lezioni
						</a>
					</div>

					<div class="h-40 w-full flex justify-center">
						<canvas bind:this={tutorCharts[tutor.id]}></canvas>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
