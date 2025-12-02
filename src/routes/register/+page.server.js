import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const fullName = data.get('fullName');
		const username = data.get('username');
		const password = data.get('password');
		const role = data.get('role');
		const secret = data.get('secret');
		const subject = data.get('subject');

		if (!fullName || !username || !password || !role) {
			return fail(400, { error: 'Tutti i campi sono obbligatori' });
		}

		if (role === 'tutor' && !subject) {
			return fail(400, { error: 'La materia è obbligatoria per i tutor' });
		}

		if (role === 'professor' && secret !== 'SUPER_SECRET_PROFESSOR_CODE') {
			return fail(403, { error: 'Codice segreto errato per la registrazione come professore' });
		}

		const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

		if (existingUser.length > 0) {
			return fail(400, { error: 'Username già in uso' });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.insert(users).values({
			fullName,
			username,
			passwordHash,
			role,
			subject: role === 'tutor' ? subject : null
		});

		throw redirect(303, '/login');
	}
};
