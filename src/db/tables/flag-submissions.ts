import { relations, sql } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { playersTable } from "./players";

export const flagSubmissionsTable = sqliteTable(
	"flag_submissions",
	{
		flag: text().notNull(),
		submitterId: text()
			.notNull()
			.references(() => playersTable.id, { onDelete: "cascade" }),
		points: int().notNull(),
		submittedAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.flag, table.submitterId] }),
		};
	},
);

export type FlagSubmission = typeof flagSubmissionsTable.$inferSelect;
export type FlagSubmissionInsert = typeof flagSubmissionsTable.$inferInsert;

export const flagSubmissionsRelations = relations(
	flagSubmissionsTable,
	({ one }) => ({
		submitter: one(playersTable, {
			fields: [flagSubmissionsTable.submitterId],
			references: [playersTable.id],
		}),
	}),
);
