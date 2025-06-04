import { A } from "@solidjs/router";

export default function NotFound() {
	return (
		<main class="flex min-h-screen w-full flex-col items-center justify-center">
			<h1 class="font-bold text-xl">Page Not Found</h1>
			<p class="text-gray-500">The page you are looking for does not exist.</p>

			<A href="/" class="btn btn-lg mt-4">
				{" "}
				Go back to the home page
			</A>
		</main>
	);
}
