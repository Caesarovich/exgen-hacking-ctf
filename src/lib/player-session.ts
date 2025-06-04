import { eq } from "drizzle-orm";
import { useSession } from "vinxi/http";
import { db } from "~/db";
import { type Player, playersTable } from "~/db/schema";

type PlayerSession = {
	player?: Player;
};

/**
 * Gets the player from the session or the URL params if not found
 * @param playerId The playerId to use if the player is not in the session
 */
export async function getPlayer() {
	"use server";
	const session = await useSession<PlayerSession>({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	const id = session.data.player?.id;

	if (!id) return null;

	const player = (
		await db.select().from(playersTable).where(eq(playersTable.id, id))
	).at(0);

	if (!player) return clearPlayerSession();

	return storePlayerInSession(player);
}

/**
 * Creates a new player and stores it in the session
 */
export async function createPlayerSession(username: string) {
	"use server";

	const session = await useSession<PlayerSession>({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	if (session.data.player) throw new Error("Player session already exists");

	const insert = await db
		.insert(playersTable)
		.values({
			name: username,
		})
		.returning();

	if (!insert[0]) throw new Error("Failed to create player");

	return storePlayerInSession(insert[0]);
}

export async function storePlayerInSession(player: Player) {
	"use server";

	const session = await useSession<PlayerSession>({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	await session.update((data) => {
		data.player = player;
		return data;
	});

	return player;
}

export async function clearPlayerSession() {
	"use server";

	const session = await useSession<PlayerSession>({
		password: Bun.env.SESSION_SECRET,
		cookie: {
			secure: false,
		},
	});

	await session.update((data) => {
		data.player = undefined;
		return data;
	});
}
