import {
	AlertDialog,
	type AlertDialogRootProps,
} from "@kobalte/core/alert-dialog";
import { Button } from "@kobalte/core/button";
import { TextField } from "@kobalte/core/text-field";
import { writeClipboard } from "@solid-primitives/clipboard";
import { createTimer } from "@solid-primitives/timer";
import {
	A,
	action,
	createAsync,
	query,
	revalidate,
	useNavigate,
	useSubmission,
} from "@solidjs/router";
import { BiSolidTimer } from "solid-icons/bi";
import {
	FaSolidArrowLeftLong,
	FaSolidArrowRightLong,
	FaSolidArrowRightToBracket,
	FaSolidCheck,
	FaSolidFlagCheckered,
	FaSolidQuestion,
	FaSolidTrophy,
	FaSolidUser,
	FaSolidX,
} from "solid-icons/fa";
import {
	Match,
	Show,
	Switch,
	createEffect,
	createSignal,
	splitProps,
} from "solid-js";
import { submitFlag } from "~/lib/flag-submition";
import { getTotalFlagValue } from "~/lib/flags";
import {
	clearPlayerSession,
	createPlayerSession,
	getPlayer as getPlayerSession,
} from "~/lib/player-session";
import Term from "../../components/Term";

function ExitConfirmation(props: AlertDialogRootProps) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const navigate = useNavigate();

	const handleExit = async () => {
		// handle exit
		writeClipboard("");
		await clearPlayerSession();

		navigate("/");
	};

	return (
		<AlertDialog {...rest}>
			<AlertDialog.Trigger>{local.children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="modal-backdrop" />
				<div class="modal modal-open">
					<AlertDialog.Content class="modal-box">
						<div class="flex justify-between">
							<AlertDialog.Title class="card-title">
								Quit game?
							</AlertDialog.Title>
							<AlertDialog.CloseButton class="btn btn-ghost btn-circle btn-sm">
								<FaSolidX />
							</AlertDialog.CloseButton>
						</div>
						<AlertDialog.Description class="mt-4">
							Once you quit the game, you will lose your progress and have to
							start over.
						</AlertDialog.Description>
						<div class="modal-action">
							<AlertDialog.CloseButton class="btn grow">
								Cancel
							</AlertDialog.CloseButton>
							<Button onClick={handleExit} class="btn btn-error grow">
								Quit
							</Button>
						</div>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}

type FlagSubmissionProps = AlertDialogRootProps;

const submitFlagAction = action(async (data: FormData) => {
	"use server";

	const flag = data.get("flag");
	if (!flag) throw new Error("Le drapeau est requis");

	await submitFlag(flag as string);

	revalidate("get-player");

	return true;
});

function FlagSubmission(props: FlagSubmissionProps) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const [open, setOpen] = createSignal(false);

	const submission = useSubmission(submitFlagAction);

	const valid = () => (submission.error?.message ? "invalid" : "valid");

	createEffect(() => {
		if (submission.result === true) setOpen(false);
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
								Submit a flag
							</AlertDialog.Title>
							<AlertDialog.CloseButton class="btn btn-ghost btn-circle btn-sm">
								<FaSolidX />
							</AlertDialog.CloseButton>
						</div>
						<AlertDialog.Description class="mt-4">
							Enter the flag you found to earn points. You have unlimited
							attempts. All flags are in the format{" "}
							<code>{"FLAG{flag_here}"}</code>, you must enter it in full.
						</AlertDialog.Description>
						<form action={submitFlagAction} class="mt-6" method="post">
							<TextField validationState={valid()} name="flag" class="w-full">
								<TextField.Input
									class=" input input-primary input-bordered w-full"
									placeholder="Enter the flag"
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
									formaction={submitFlagAction}
								>
									Submit
								</Button>
							</div>
						</form>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}

type OnboardingPaginationProps = {
	pageIndex: number;
	setPageIndex: (index: number) => void;
	maxIndex: number;
	onSubmission?: () => void;
};

function OnboardingPagination(props: OnboardingPaginationProps) {
	return (
		<div class="modal-action">
			<Show when={props.pageIndex !== 0}>
				<Button
					class="btn btn-ghost grow"
					onClick={() => props.setPageIndex(props.pageIndex - 1)}
				>
					<FaSolidArrowLeftLong /> Back
				</Button>
			</Show>
			<Show when={props.pageIndex !== props.maxIndex}>
				<Button
					class="btn btn-primary grow"
					onClick={() => props.setPageIndex(props.pageIndex + 1)}
				>
					Next <FaSolidArrowRightLong />
				</Button>
			</Show>
		</div>
	);
}

type OnboardingModalProps = {
	pageIndex: number;
	maxIndex: number;
	setPageIndex: (index: number) => void;
};

function WelcomeModal(props: OnboardingModalProps) {
	return (
		<AlertDialog.Content class="modal-box">
			<AlertDialog.Title class="card-title">
				Welcome to the ExGen Hacking Challenge!
			</AlertDialog.Title>

			<AlertDialog.Description class="mt-4">
				This game is a capture the flag (CTF) competition where you must solve
				challenges to obtain flags and earn points. Flags are pieces of text
				that look like <code>{"FLAG{flag_here}"}</code>. When you find a flag,
				don't forget to submit it to earn points.
				<br />
				<br />
				To get the flags, you will need to navigate the system using the
				terminal. To do this, you will need to learn and use commands to
				interact with the system. Many clues are hidden in the system, so be
				sure to explore everywhere and try different things.
			</AlertDialog.Description>

			<OnboardingPagination {...props} />
		</AlertDialog.Content>
	);
}

function StoryModal(props: OnboardingModalProps) {
	return (
		<AlertDialog.Content class="modal-box">
			<AlertDialog.Title class="card-title">The Story</AlertDialog.Title>

			<AlertDialog.Description class="mt-4">
				You play as "Zero", a hacker who received a mysterious tip about a
				secret project called "Project Overwatch". The mysterious informant
				mentioned that the project could lead to a global catastrophe if it
				falls into the wrong hands.
				<br />
				<br />
				Using your hacking skills, you managed to infiltrate the system because
				a project member ("Jamie") was using a weak password. You now have
				access to the system and can begin your investigation.
				<br />
				<br />
				Your mission is to infiltrate the system and discover what Project
				Overwatch is. You will need to solve challenges, find flags, and
				navigate the system to uncover the truth.
				<br />
				<br />
				Do you have what it takes to save the world?
			</AlertDialog.Description>

			<OnboardingPagination {...props} />
		</AlertDialog.Content>
	);
}

function UserNameModal(props: OnboardingModalProps) {
	const submitAction = action(async (data: FormData) => {
		const name = data.get("name");
		if (!name) throw new Error("Name is required");

		if ((name as string).length < 3)
			throw new Error("Name must be at least 3 characters long");
		if ((name as string).length > 32)
			throw new Error("Name must be at most 32 characters long");

		await createPlayerSession(name as string);
	});

	const submission = useSubmission(submitAction);

	const [errorText, setErrorText] = createSignal<string>("");

	createEffect(() => {
		setErrorText(submission.error?.message || "");
	});

	return (
		<AlertDialog.Content class="modal-box">
			<AlertDialog.Title class="card-title">Enter your name</AlertDialog.Title>

			<AlertDialog.Description class="mt-4">
				If you want your progress to be saved and your name to appear on the
				leaderboard, please enter your name below.
				<br />
				<br />
				By entering your name, you agree that your personal data will be
				processed in accordance with our{" "}
				<A href="/privacy-policy" class="link">
					Privacy Policy
				</A>
				. If you are under 13, please do not enter your real name.
			</AlertDialog.Description>

			<form action={submitAction} class="mt-6" method="post">
				<TextField
					validationState={!errorText() ? "valid" : "invalid"}
					name="name"
					class="w-full"
				>
					<TextField.Input
						class=" input input-primary input-bordered w-full"
						placeholder="Enter your name"
						autocomplete="off"
					/>
					<TextField.ErrorMessage class="label label-text text-error">
						{errorText()}
					</TextField.ErrorMessage>
				</TextField>
				<div class="modal-action">
					<Button
						class="btn btn-ghost grow"
						onClick={() => props.setPageIndex(props.pageIndex - 1)}
					>
						<FaSolidArrowLeftLong /> Back
					</Button>
					<Button
						disabled={submission.pending}
						class="btn btn-primary grow"
						type="submit"
						formaction={submitAction}
					>
						Play <FaSolidCheck />
					</Button>
				</div>
			</form>
		</AlertDialog.Content>
	);
}

function HelpModal(props: AlertDialogRootProps) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const [pageIndex, setPageIndex] = createSignal<number>(0);

	return (
		<AlertDialog {...rest}>
			<AlertDialog.Trigger>{local.children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="modal-backdrop" />
				<div class="modal modal-open">
					<Switch>
						<Match when={pageIndex() === 0}>
							<BasicCommandsModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
						<Match when={pageIndex() === 1}>
							<WelcomeModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
						<Match when={pageIndex() === 2}>
							<StoryModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
					</Switch>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}
function BasicCommandsModal(props: OnboardingModalProps) {
	return (
		<AlertDialog.Content class="modal-box">
			<div class="flex justify-between">
				<AlertDialog.Title class="card-title">
					Terminal Basics
				</AlertDialog.Title>
				<AlertDialog.CloseButton class="btn btn-ghost btn-circle btn-sm">
					<FaSolidX />
				</AlertDialog.CloseButton>
			</div>
			<AlertDialog.Description class="mt-4">
				Here are some basic commands to help you get started:
				<ul class="mt-2 list-inside list-disc">
					<li>
						<code>ls</code> - List directory contents
					</li>
					<li>
						<code>cd [directory]</code> - Change the current directory, you can
						also use <code>cd ..</code> to go back
					</li>
					<li>
						<code>cat [file]</code> - Display the contents of a file
					</li>
					<li>
						<code>help</code> - Show help information, you can also get help for
						a specific command like this <code>help [command]</code>
					</li>
				</ul>
				<br />
				<div>
					Understanding the prompt: <code> jamie@exgen:/home/jamie </code>
					The prompt is made up of 3 parts:
					<ul class="mt-2 list-inside list-disc">
						<li>
							<code>jamie</code> - The current user
						</li>
						<li>
							<code>exgen</code> - The system name
						</li>
						<li>
							<code>/home/jamie</code> - The current directory
						</li>
					</ul>
				</div>
			</AlertDialog.Description>
			<OnboardingPagination {...props} />
		</AlertDialog.Content>
	);
}

function OnboardingModal(props: AlertDialogRootProps) {
	const [local, ...rest] = splitProps(props, ["children"]);

	const [pageIndex, setPageIndex] = createSignal<number>(0);

	return (
		<AlertDialog open {...rest}>
			<AlertDialog.Trigger>{local.children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay class="modal-backdrop" />
				<div class="modal modal-open">
					<Switch>
						<Match when={pageIndex() === 0}>
							<WelcomeModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
						<Match when={pageIndex() === 1}>
							<StoryModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
						<Match when={pageIndex() === 2}>
							<UserNameModal
								pageIndex={pageIndex()}
								setPageIndex={setPageIndex}
								maxIndex={2}
							/>
						</Match>
					</Switch>
				</div>
			</AlertDialog.Portal>
		</AlertDialog>
	);
}

const maxScore = query(async () => getTotalFlagValue(), "max-score");
const getPlayer = query(async () => getPlayerSession(), "get-player");

function Score() {
	const player = createAsync(() => getPlayer(), {
		deferStream: true,
	});
	const maxScoreValue = createAsync(() => maxScore(), {
		deferStream: true,
	});

	const startTime = () => new Date(player()?.startedAt ?? 0).getTime();

	const [timeNow, setTimeNow] = createSignal(new Date().getTime());

	const paused = () => player() == null;

	const elapsedTime = () => timeNow() - startTime();

	const elapsedMinutes = () => Math.floor(((elapsedTime() / 1000) % 3600) / 60);
	const elapsedSeconds = () => Math.floor((elapsedTime() / 1000) % 60);

	createTimer(
		() => setTimeNow(new Date().getTime()),
		() => !paused() && 1000,
		setInterval,
	);

	return (
		<div class="join join-horizontal h-12">
			<div
				data-tip="Username"
				class="tooltip tooltip-bottom join-item flex items-center gap-2 bg-base-300 p-4"
			>
				<FaSolidUser />
				{player()?.name || "Guest"}
			</div>
			<div
				data-tip="Score"
				class="tooltip tooltip-bottom join-item flex items-center gap-2 bg-base-300 p-4"
			>
				<FaSolidTrophy />
				{player()?.score || 0} / {maxScoreValue() || 0}
			</div>
			<div
				data-tip="Timer"
				class="tooltip tooltip-bottom join-item flex items-center gap-2 bg-base-300 p-4"
			>
				<BiSolidTimer size={22} />
				<Show when={!paused()} fallback={"-"}>
					{elapsedMinutes()}min {elapsedSeconds()}s
				</Show>
			</div>
		</div>
	);
}

export default function Play() {
	const player = createAsync(() => getPlayer());

	return (
		<main class="flex h-lvh w-full flex-col gap-4 p-4">
			<div class="flex w-full items-center justify-between gap-4">
				<div
					class="tooltip tooltip-error tooltip-right"
					data-tip="Quit the game"
				>
					<ExitConfirmation>
						<div class="btn btn-square btn-outline btn-error">
							<FaSolidArrowRightToBracket />
						</div>
					</ExitConfirmation>
				</div>

				<Score />

				<div class="flex gap-4">
					<div class="tooltip tooltip-bottom" data-tip="Voir l'aide">
						<HelpModal>
							<div class="btn btn-square btn-outline">
								<FaSolidQuestion />
							</div>
						</HelpModal>
					</div>

					<FlagSubmission>
						<div class="btn btn-outline btn-primary">
							<FaSolidFlagCheckered /> Submit a flag
						</div>
					</FlagSubmission>
				</div>
			</div>
			<div class="flex w-full grow overflow-clip rounded-md bg-base-200 shadow-sm">
				<Show when={player()} fallback={<OnboardingModal />}>
					<Term />
				</Show>
			</div>
		</main>
	);
}
