import { makeTimer } from "@solid-primitives/timer";
import { createAsync, query, revalidate } from "@solidjs/router";
import { asc, desc, eq, sql } from "drizzle-orm";
import { FaSolidFlagCheckered, FaSolidTrophy } from "solid-icons/fa";
import { For } from "solid-js";
import { db } from "~/db";
import { flagSubmissionsTable, playersTable } from "~/db/schema";

const getLatestSubmissions = query(async (limit: number) => {
	"use server";

	return db
		.select({
			submittedAt: flagSubmissionsTable.submittedAt,
			points: flagSubmissionsTable.points,
			playerName: playersTable.name,
		})
		.from(flagSubmissionsTable)
		.innerJoin(
			playersTable,
			eq(flagSubmissionsTable.submitterId, playersTable.id),
		)
		.orderBy(desc(flagSubmissionsTable.submittedAt))
		.limit(limit);
}, "get-latest-submissions");

function LatestSubmissions() {
	const submissions = createAsync(() => getLatestSubmissions(20));

	return (
		<div class="overflow-clip rounded-lg bg-base-300 shadow-lg">
			<div class="h-12 bg-base-200 p-2 ">
				<h3 class="flex items-center gap-4 text-xl">
					<FaSolidFlagCheckered class="text-2xl text-accent" /> Latest
					submissions
				</h3>
			</div>

			<div class="h-96 overflow-y-auto">
				<ul>
					<For each={submissions()}>
						{(item) => (
							<li class="flex items-center gap-4 border-base-200 border-b p-2">
								<p class="text-base-400 text-xs">
									{new Date(item.submittedAt).toLocaleString("fr-FR")}
								</p>
								<p>
									<span class="font-bold">{item.playerName}</span> submitted a
									flag worth {""}
									<span class="font-bold">{item.points}</span> points
								</p>
							</li>
						)}
					</For>
				</ul>
			</div>
		</div>
	);
}

/**
 * Format seconds into a human readable time (MM:SS)
 * @param seconds
 * @returns
 */
function formatPlayerTime(seconds: number) {
	const minutes = Math.floor((seconds % 3600) / 60);
	const sec = seconds % 60;

	return `${minutes} minutes ${sec} seconds`;
}

const getLeaderboard = query(async () => {
	"use server";

	return db
		.select()
		.from(playersTable)
		.orderBy(
			desc(playersTable.score),
			asc(
				sql`(strftime('%s', ${playersTable.endedAt}) - strftime('%s', ${playersTable.startedAt}))`,
			),
		);
}, "get-latest-submissions");

function Leaderboard() {
	const players = createAsync(() => getLeaderboard());

	return (
		<div class="flex h-full flex-col overflow-clip rounded-lg bg-base-300 shadow-lg">
			<div class="h-12 bg-base-200 p-2 ">
				<h3 class="flex items-center gap-4 text-xl">
					<FaSolidTrophy class="text-2xl text-accent" /> Leaderboard
				</h3>
			</div>

			<div class="h-full overflow-y-auto">
				<table class="table-zebra table-lg table-pin-rows table">
					<tbody>
						<For each={players()}>
							{(item, index) => (
								<tr class="border-base-200 border-b p-2">
									<td>{index() + 1}</td>
									<td>{item.name}</td>
									<td>{item.score}</td>
									<td>
										{formatPlayerTime(
											(new Date(item.endedAt).getTime() -
												new Date(item.startedAt).getTime()) /
												1000,
										)}
									</td>
								</tr>
							)}
						</For>
					</tbody>
					<tfoot>
						<tr class="border-base-200 border-b p-2">
							<th class="text-base-400 text-xs">Rank</th>
							<th class="text-base-400 text-xs">Player</th>
							<th class="text-base-400 text-xs">Score</th>
							<th class="text-base-400 text-xs">Time</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}

export default function LeaderboardPage() {
	const refresh = () => {
		revalidate("get-latest-submissions");
		revalidate("get-leaderboard");
	};

	makeTimer(refresh, 1_000, setInterval);

	return (
		<main class="grid h-lvh w-lvw grid-flow-col grid-cols-1 grid-rows-4 gap-8 p-8 lg:grid-cols-2 lg:grid-rows-2">
			<div class="row-span-2 lg:col-start-2">
				<Leaderboard />
			</div>
			<LatestSubmissions />
			<LatestSubmissions />
		</main>
	);
}
