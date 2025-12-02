import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session_id');

	if (!sessionId) {
		event.locals.user = null;
		return resolve(event);
	}

    const sessionData = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    
	if (sessionData.length > 0) {
        const s = sessionData[0];
		if (s.expiresAt < new Date()) {
            await db.delete(sessions).where(eq(sessions.id, sessionId));
			event.cookies.delete('session_id', { path: '/' });
			event.locals.user = null;
		} else {
            const userData = await db.select().from(users).where(eq(users.id, s.userId)).limit(1);
            if (userData.length > 0) {
                event.locals.user = userData[0];
            } else {
                event.locals.user = null;
            }
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
}
