import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { reviews } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	if (locals.user.role !== 'tutor') {
		throw redirect(302, '/professor');
	}

	const userReviews = await db
		.select()
		.from(reviews)
		.where(eq(reviews.tutorId, locals.user.id))
		.orderBy(desc(reviews.createdAt));

    // Calculate average rating
    const totalRating = userReviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = userReviews.length > 0 ? (totalRating / userReviews.length).toFixed(1) : 'N/A';

    // Generate review link
    const reviewLink = `${url.origin}/review/${locals.user.id}`;

	return {
		user: locals.user,
		reviews: userReviews,
        averageRating,
        reviewLink
	};
};
