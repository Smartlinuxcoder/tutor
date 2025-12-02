import { pgTable, serial, text, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull(), // 'tutor' or 'professor'
	fullName: text('full_name').notNull(),
	subject: text('subject'), // Added subject for tutors
	createdAt: timestamp('created_at').defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id').references(() => users.id).notNull(),
	expiresAt: timestamp('expires_at').notNull()
});

export const reviews = pgTable('reviews', {
	id: serial('id').primaryKey(),
	tutorId: integer('tutor_id').references(() => users.id).notNull(),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	ipAddress: varchar('ip_address', { length: 45 }),
	createdAt: timestamp('created_at').defaultNow()
});

export const registryEntries = pgTable('registry_entries', {
	id: serial('id').primaryKey(),
	tutorId: integer('tutor_id').references(() => users.id).notNull(),
	studentFirstName: text('student_first_name').notNull(),
	studentLastName: text('student_last_name').notNull(),
	studentClass: text('student_class').notNull(),
	topicsCovered: text('topics_covered').notNull(),
	signatureData: text('signature_data').notNull(), // Base64 string
	date: timestamp('date').defaultNow().notNull()
});
