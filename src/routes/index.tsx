import { A } from "@solidjs/router";
import { FaSolidLock, FaSolidPlay, FaSolidTrophy } from "solid-icons/fa";

export default function Home() {
	return (
		<main class="flex min-h-screen w-full flex-col items-center justify-center gap-12">
			<h1 class="text-3xl">Welcome on the ExGen Hacking challenge!</h1>
			<p class="px-64 text-center text-gray-500">
				This is a CTF (Capture The Flag) "hacking" challenge where you need to
				navigate through a simulated system, solve challenges, and capture flags
				to score points.
				<br />
				<br />I made this game to help my students learn the basics of Linux
				commands. So this challenge is not meant to be too hard, but rather a
				fun way to learn and practice basic command line skills.
			</p>

			<div class="flex flex-col gap-4">
				<A href="/play" class="btn btn-lg btn-primary">
					Play the game
					<FaSolidPlay />
				</A>
				<A href="/leaderboard" class="btn btn-lg btn-secondary">
					Watch the leaderboard
					<FaSolidTrophy />
				</A>
				<A href="/admin" class="btn btn-lg">
					Access admin panel
					<FaSolidLock />
				</A>
			</div>

			<A href="/privacy-policy" class="link">
				Privacy Policy
			</A>
		</main>
	);
}
