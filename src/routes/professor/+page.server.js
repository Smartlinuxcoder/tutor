import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, reviews, registryEntries } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (locals.user.role !== 'professor') {
		throw redirect(302, '/dashboard');
	}

	const allTutors = await db.select().from(users).where(eq(users.role, 'tutor'));
	const allReviews = await db.select().from(reviews);
	const allRegistryEntries = await db.select().from(registryEntries).orderBy(desc(registryEntries.date));

	// Process data for dashboard
	const tutorsWithStats = allTutors.map((tutor) => {
		const tutorReviews = allReviews.filter((r) => r.tutorId === tutor.id);
		const totalRating = tutorReviews.reduce((acc, r) => acc + r.rating, 0);
		const averageRating =
			tutorReviews.length > 0 ? (totalRating / tutorReviews.length).toFixed(1) : 0;

		return {
			...tutor,
			reviewCount: tutorReviews.length,
			averageRating: parseFloat(averageRating),
            reviews: tutorReviews
		};
	});
    
    // Sort by average rating desc
    tutorsWithStats.sort((a, b) => b.averageRating - a.averageRating);

	return {
		user: locals.user,
		tutors: tutorsWithStats,
        totalReviews: allReviews.length,
		allRegistryEntries,
		allReviews
	};
};
