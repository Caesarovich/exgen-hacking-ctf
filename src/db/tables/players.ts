import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { flagSubmissionsTable } from "./flag-submissions";

export const playersTable = sqliteTable("players", {
	id: text()
		.notNull()
		.$defaultFn(() => createId()),
	name: text().notNull(),
	score: int().notNull().default(0),
	startedAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	endedAt: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export type Player = typeof playersTable.$inferSelect;
export type PlayerInsert = typeof playersTable.$inferInsert;

export const playersRelations = relations(playersTable, ({ one }) => ({
	flagSubmissions: one(flagSubmissionsTable, {
		fields: [playersTable.id],
		references: [flagSubmissionsTable.submitterId],
	}),
}));
