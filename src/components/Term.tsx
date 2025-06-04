import { useWindowSize } from "@solid-primitives/resize-observer";
import type { FitAddon } from "@xterm/addon-fit";
import { createEffect } from "solid-js";
import { type Terminal, XTerm } from "../../solid-xterm-hotfix";

export default function () {
	let term: Terminal | null = null;

	let ws: WebSocket | null = null;

	let fitAddon: FitAddon | null = null;

	const log = async (user: string, ...args: string[]) => {
		console.log("[ws]", user, ...args);
	};

	const disconnect = () => {
		if (ws) {
			log("ws", "Disconnecting...");
			ws.close();
			ws = null;
		}
	};

	const sendToServer = async (data: string) => {
		ws?.send(data);
	};

	const receiveFromServer = async (data: string) => {
		log("ws", "Received:", data);

		const normalizedData = data.replace(/\r?\n/g, "\r\n"); // Normalize line endings

		term?.write(normalizedData);
	};

	const connect = () => {
		const isSecure = location.protocol === "https:";
		const url = `${(isSecure ? "wss://" : "ws://") + location.host}/play/ws`;

		disconnect(); // Disconnect any existing connection

		log("ws", "Connecting to", url, "...");

		ws = new WebSocket(url);

		ws.addEventListener("open", () => {
			log("ws", "Connected");
		});

		ws.addEventListener("close", () => {
			log("ws", "Connection closed");
		});

		ws.addEventListener("error", (err) => {
			log("ws", "Error:");
			console.error(err);
		});

		ws.addEventListener("message", async (event) => {
			log("ws", "message", event.data);
			const data =
				typeof event.data === "string" ? event.data : await event.data.text();

			receiveFromServer(data);
		});
	};

	const size = useWindowSize();

	createEffect(() => {
		console.log("Screen size changed:", size.width, size.height);
		console.log("Now using dimensions:", fitAddon?.proposeDimensions());
		fitAddon?.fit();
	});

	return (
		<XTerm
			// addons={[FitAddon]}
			options={{ cursorBlink: true, allowTransparency: true, fontSize: 32 }}
			class={"flex w-full flex-1 text-xl"} // Set the height to 100% of the viewport height
			onData={sendToServer}
			onMount={async (terminal) => {
				const { FitAddon } = await import("@xterm/addon-fit");

				fitAddon = new FitAddon();

				terminal.loadAddon(fitAddon);

				fitAddon.fit();

				term = terminal;

				connect();

				return disconnect;
			}}
		/>
	);
}
