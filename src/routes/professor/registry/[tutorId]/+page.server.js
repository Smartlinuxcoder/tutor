import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, registryEntries, reviews } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (locals.user.role !== 'professor') {
		throw redirect(302, '/dashboard');
	}

	const tutorId = parseInt(params.tutorId);
	if (isNaN(tutorId)) {
		throw error(400, 'ID Tutor non valido');
	}

	const tutorResult = await db.select().from(users).where(eq(users.id, tutorId)).limit(1);
	const tutor = tutorResult[0];

	if (!tutor || tutor.role !== 'tutor') {
		throw error(404, 'Tutor non trovato');
	}

	const entries = await db
		.select()
		.from(registryEntries)
		.where(eq(registryEntries.tutorId, tutorId))
		.orderBy(desc(registryEntries.date));

	const tutorReviews = await db
		.select()
		.from(reviews)
		.where(eq(reviews.tutorId, tutorId))
		.orderBy(desc(reviews.createdAt));

	return {
		user: locals.user,
		tutor,
		entries,
		reviews: tutorReviews
	};
};
