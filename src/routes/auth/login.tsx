import { Alert } from "@kobalte/core/alert";
import { Button } from "@kobalte/core/button";
import { TextField } from "@kobalte/core/text-field";
import { action, redirect, useSubmission } from "@solidjs/router";
import { BiRegularErrorCircle } from "solid-icons/bi";
import { FaSolidKey, FaSolidUser } from "solid-icons/fa";
import { Show, createEffect, createSignal } from "solid-js";
import { login } from "~/lib/admin-sessions";

export default function LoginPage() {
	const loginAction = action(async (formData: FormData) => {
		const username = String(formData.get("username"));
		const password = String(formData.get("password"));

		await login(username, password);

		throw redirect("/admin");
	}, "login");

	const submission = useSubmission(loginAction);

	const [disabled, setDisabled] = createSignal<boolean>(false);

	createEffect(() => {
		setDisabled(submission.pending === true);
	});

	return (
		<main class="flex min-h-screen w-full flex-col items-center justify-center gap-12 p-12">
			<h1 class="text-3xl">Admin Login</h1>
			<p class="text-center text-gray-500">
				This login page is <strong>NOT</strong> part of the challenge. So please
				don't try to hack it :)
			</p>

			<form action={loginAction} method="post" class="flex flex-col gap-4">
				<TextField
					name="username"
					class="input input-bordered flex items-center gap-2"
				>
					<TextField.Label>
						{" "}
						<FaSolidUser />{" "}
					</TextField.Label>
					<TextField.Input placeholder="Username" />
				</TextField>
				<TextField
					name="password"
					class="input input-bordered flex items-center gap-2"
				>
					<TextField.Label>
						<FaSolidKey />
					</TextField.Label>
					<TextField.Input type="password" placeholder="Password" />
				</TextField>
				<Button
					disabled={disabled()}
					type="submit"
					formaction={loginAction}
					class="btn aria-disabled:btn-disabled"
				>
					<Show
						when={!disabled()}
						fallback={<span class="loading loading-spinner" />}
					>
						Login
					</Show>
				</Button>
			</form>

			<Show when={submission.error}>
				<Alert class="alert alert-error max-w-96">
					<BiRegularErrorCircle /> {submission.error.message}
				</Alert>
			</Show>
		</main>
	);
}
