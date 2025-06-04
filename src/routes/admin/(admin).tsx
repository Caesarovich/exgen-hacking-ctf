import { Button } from "@kobalte/core/button";
import {
	action,
	createAsync,
	query,
	revalidate,
	useSubmission,
} from "@solidjs/router";
import { For, createEffect, createSignal, splitProps } from "solid-js";
import { db } from "~/db";
import { type Player, flagSubmissionsTable, playersTable } from "~/db/schema";
import { ensureAdminUser } from "~/lib/admin-sessions";

import {
	AlertDialog,
	type AlertDialogRootProps,
} from "@kobalte/core/alert-dialog";
import { TextField } from "@kobalte/core/text-field";
import { desc, eq } from "drizzle-orm";
import { FaSolidPen, FaSolidTrashCan, FaSolidX } from "solid-icons/fa";

type PlayerDeleteConfirmationDialogProps = AlertDialogRootProps & {
	playerId: string;
	playerName: string;
};

const deleteUserAction = action(async (data: FormData) => {
	"use server";

	const userId = data.get("userId");
	if (!userId) throw new Error("userId is required");

	await ensureAdminUser();

	await db.delete(playersTable).where(eq(playersTable.id, userId as string));
	await db
		.delete(flagSubmissionsTable)
		.where(eq(flagSubmissionsTable.submitterId, userId as string));

	revalidate("players");

	return true;
});
function PlayerDeleteConfirmationDialog(
	props: PlayerDeleteConfirmationDialogProps,
) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const [open, setOpen] = createSignal(false);

	const handleDeleteAction = deleteUserAction;

	const submission = useSubmission(handleDeleteAction);

	createEffect(() => {
		if (submission.result === true) setOpen(false);
	});

	const formData = new FormData();
	formData.set("userId", props.playerId);

	return (
		<AlertDialog open={open()} onOpenChange={setOpen} {...rest}>
			<AlertDialog.Trigger>{local.children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="modal-backdrop" />
				<div class="modal modal-open">
					<AlertDialog.Content class="modal-box">
						<div class="flex justify-between">
							<AlertDialog.Title class="card-title">
								Delete the player ?
							</AlertDialog.Title>
							<AlertDialog.CloseButton class="btn btn-ghost btn-circle btn-sm">
								<FaSolidX />
							</AlertDialog.CloseButton>
						</div>
						<AlertDialog.Description class="mt-4">
							This action is irreversible. Are you sure you want to delete this
							player?
							<br />
							<br />
							Player ID: {props.playerId}
							<br />
							Player Name: {props.playerName}
						</AlertDialog.Description>
						<form
							action={handleDeleteAction.with(formData)}
							method="post"
							class="modal-action"
						>
							<AlertDialog.CloseButton class="btn grow">
								Cancel
							</AlertDialog.CloseButton>
							<Button
								type="submit"
								disabled={submission.pending}
								formaction={handleDeleteAction.with(formData)}
								class="btn btn-error grow"
							>
								Delete
							</Button>
						</form>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}

type PlayerEditDialogProps = AlertDialogRootProps & {
	player: Player;
};

const editUserNameAction = action(async (data: FormData) => {
	"use server";

	await ensureAdminUser();

	const id = data.get("playerId");
	if (!id) throw new Error("playerId is required");

	const name = data.get("name");
	if (!name) throw new Error("Name is required");

	// We have to use the existing value, otherwise it will be set to the current time
	const endedAt = data.get("endedAt");
	if (!endedAt) throw new Error("endedAt is required");

	await db
		.update(playersTable)
		.set({ name: name as string, endedAt: endedAt as string })
		.where(eq(playersTable.id, id as string));

	revalidate("players");

	return true;
});
function PlayerEditDialog(props: PlayerEditDialogProps) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const [open, setOpen] = createSignal(false);

	const editNameAction = editUserNameAction;

	const submission = useSubmission(editNameAction);

	const valid = () => (submission.error?.message ? "invalid" : "valid");

	createEffect(() => {
		if (submission.result === true) setOpen(false);
	});

	const [name, setName] = createSignal(props.player.name);

	const formData = new FormData();
	formData.set("playerId", props.player.id);
	formData.set("endedAt", props.player.endedAt);

	createEffect(() => {
		formData.set("name", name());
		console.log("name", name());
	});

	return (
		<AlertDialog open={open()} onOpenChange={setOpen} {...rest}>
			<AlertDialog.Trigger>{local.children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="modal-backdrop" />
				<div class="modal modal-open">
					<AlertDialog.Content class="modal-box">
						<div class="flex justify-between">
							<AlertDialog.Title class="card-title">
								Edit name
							</AlertDialog.Title>
							<AlertDialog.CloseButton class="btn btn-ghost btn-circle btn-sm">
								<FaSolidX />
							</AlertDialog.CloseButton>
						</div>
						<AlertDialog.Description class="mt-4">
							Change the name of the player. This action is irreversible.
						</AlertDialog.Description>
						<form
							action={editNameAction.with(formData)}
							class="mt-6"
							method="post"
						>
							<TextField
								defaultValue={props.player.name}
								validationState={valid()}
								name="name"
								class="w-full"
								onChange={setName}
							>
								<TextField.Input
									class="input input-primary input-bordered w-full"
									placeholder="Enter the new name"
									autocomplete="off"
								/>
								<TextField.ErrorMessage class="label label-text text-error">
									{submission.error?.message}
								</TextField.ErrorMessage>
							</TextField>
							<div class="modal-action">
								<AlertDialog.CloseButton class="btn grow">
									Cancel
								</AlertDialog.CloseButton>
								<Button
									disabled={submission.pending}
									class="btn btn-primary grow"
									type="submit"
									formaction={editNameAction.with(formData)}
								>
									Rename
								</Button>
							</div>
						</form>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}

const getPlayers = query(async () => {
	"use server";

	await ensureAdminUser();

	return db.select().from(playersTable).orderBy(desc(playersTable.startedAt));
}, "players");

function PlayerList() {
	const users = createAsync(() => getPlayers());

	return (
		<table class="table w-full bg-base-200">
			<thead>
				<tr>
					<th>Username</th>
					<th>Score</th>
					<th>Created at</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<For
					each={users()}
					fallback={
						<tr>
							<td>Loading...</td>
						</tr>
					}
				>
					{(user) => (
						<tr>
							<td>
								<p class="font-bold">{user.name}</p>
								<p class="text-sm opacity-50">ID: {user.id}</p>
							</td>
							<td>{user.score}</td>
							<td>{user.startedAt}</td>
							<td class="flex gap-1">
								<div class="tooltip" data-tip="Edit name">
									<PlayerEditDialog player={user}>
										<div class="btn btn-sm btn-square btn-primary">
											<FaSolidPen />
										</div>
									</PlayerEditDialog>
								</div>

								<div class="tooltip" data-tip="Delete player">
									<PlayerDeleteConfirmationDialog
										playerName={user.name}
										playerId={user.id}
									>
										<div class="btn btn-sm btn-square btn-error">
											<FaSolidTrashCan />
										</div>
									</PlayerDeleteConfirmationDialog>
								</div>
							</td>
						</tr>
					)}
				</For>
			</tbody>
		</table>
	);
}

export const route = {
	preload: () => getPlayers(),
};

export default function AdminPage() {
	return (
		<main class="flex min-h-screen w-full flex-col items-center justify-center gap-12 p-4">
			<h1 class="text-3xl">Admin page</h1>
			<PlayerList />
		</main>
	);
}
