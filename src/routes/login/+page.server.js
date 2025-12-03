import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.trim();
		const password = data.get('password')?.trim();

		if (!username || !password) {
			return fail(400, { error: 'Username e password sono obbligatori' });
		}

		const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
		const user = userResult[0];

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			return fail(400, { error: 'Credenziali non valide' });
		}

		const sessionId = uuidv4();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

		await db.insert(sessions).values({
			id: sessionId,
			userId: user.id,
			expiresAt
		});

		cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			expires: expiresAt
		});

		if (user.role === 'professor') {
			throw redirect(303, '/professor');
		} else {
			throw redirect(303, '/dashboard');
		}
	}
};
