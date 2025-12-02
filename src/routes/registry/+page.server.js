import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { registryEntries } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (locals.user.role !== 'tutor') {
		throw redirect(302, '/professor');
	}

	const entries = await db
		.select()
		.from(registryEntries)
		.where(eq(registryEntries.tutorId, locals.user.id))
		.orderBy(desc(registryEntries.date));

	return {
		user: locals.user,
		entries
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'tutor') {
			return fail(403, { error: 'Non autorizzato' });
		}

		const data = await request.formData();
		const studentFirstName = data.get('studentFirstName');
		const studentLastName = data.get('studentLastName');
		const studentClass = data.get('studentClass');
		const topicsCovered = data.get('topicsCovered');
		const signatureData = data.get('signatureData');

		if (!studentFirstName || !studentLastName || !studentClass || !topicsCovered || !signatureData) {
			return fail(400, { error: 'Tutti i campi sono obbligatori, inclusa la firma.' });
		}

		await db.insert(registryEntries).values({
			tutorId: locals.user.id,
			studentFirstName,
			studentLastName,
			studentClass,
			topicsCovered,
			signatureData
		});

		return { success: true };
	}
};
