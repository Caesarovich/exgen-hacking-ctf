import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { flagSubmissionsTable, playersTable } from "~/db/schema";
import { getFlagValue, isFlag } from "./flags";
import { getPlayer } from "./player-session";

async function hasAlreadySubmittedFlag(flag: string, playerId: string) {
	"use server";

	const submissions = await db
		.select()
		.from(flagSubmissionsTable)

		.where(
			and(
				eq(flagSubmissionsTable.submitterId, playerId),
				eq(flagSubmissionsTable.flag, flag),
			),
		);

	return submissions.length > 0;
}

export async function submitFlag(flag: string) {
	"use server";
	const player = await getPlayer();

	if (!player) {
		throw new Error("You are not logged in");
	}

	if (await hasAlreadySubmittedFlag(flag, player.id)) {
		throw new Error("You have already submitted this flag");
	}

	if (!isFlag(flag)) {
		throw new Error("Invalid flag");
	}

	const points = getFlagValue(flag);

	await db
		.insert(flagSubmissionsTable)
		.values({
			submitterId: player.id,
			flag,
			points,
		})
		.execute();

	await db
		.update(playersTable)
		.set({
			score: player.score + points,
		})
		.where(eq(playersTable.id, player.id));
}
