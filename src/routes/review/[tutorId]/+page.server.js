import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, reviews } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const tutorId = parseInt(params.tutorId);
	if (isNaN(tutorId)) {
		throw error(400, 'ID Tutor non valido');
	}

	const tutorResult = await db.select().from(users).where(eq(users.id, tutorId)).limit(1);
	const tutor = tutorResult[0];

	if (!tutor || tutor.role !== 'tutor') {
		throw error(404, 'Tutor non trovato');
	}

	return {
		tutor: {
			id: tutor.id,
			fullName: tutor.fullName
		}
	};
};

export const actions = {
	default: async ({ request, params, cookies, getClientAddress }) => {
		const tutorId = parseInt(params.tutorId);
		const data = await request.formData();
		const rating = parseInt(data.get('rating'));
		const comment = data.get('comment');

		if (cookies.get(`reviewed_tutor_${tutorId}`)) {
			return fail(429, { error: 'Hai già inviato una recensione per questo tutor oggi.' });
		}

		if (!rating || rating < 1 || rating > 5) {
			return fail(400, { error: 'Il voto deve essere compreso tra 1 e 5.' });
		}

		const ipAddress = getClientAddress();

		await db.insert(reviews).values({
			tutorId,
			rating,
			comment,
			ipAddress
		});

		cookies.set(`reviewed_tutor_${tutorId}`, 'true', {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'strict'
		});

		return { success: true };
	}
};
