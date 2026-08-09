// lib/db/schema.ts
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).$type<'admin' | 'expert' | 'student'>().notNull(), // Phân quyền
  class: varchar('class', { length: 50 }), // Dành riêng cho Học sinh (ví dụ: 10A1)
  createdAt: timestamp('created_at').defaultNow(),
});