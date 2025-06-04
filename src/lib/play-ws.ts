import { Readable, Writable } from "node:stream";
import type { Peer } from "crossws";
import { eventHandler } from "vinxi/http";
import type { Shell } from "~/lib/mock-system/src/system/shell";
import { System } from "./mock-system/src/system/system";

function bufferToHexString(buffer: Buffer): string {
	// biome-ignore lint/suspicious/noControlCharactersInRegex: This regex is used to match control characters
	return buffer.toString("utf8").replace(/[\x00-\x1F\x7F-\x9F\s]/g, (char) => {
		return `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`;
	});
}

const shells = new Map<string, Shell>();

function createIO(peer: Peer) {
	const stdin = new Readable({
		read(size) {},
	});

	const stdout = new Writable({
		write(chunk, encoding, callback) {
			// console.log("stdout => ", `("${bufferToHexString(chunk)}")`, chunk);
			peer.send(chunk.toString());
			callback();
		},
	});

	const stderr = new Writable({
		write(chunk, encoding, callback) {
			// console.log("stderr => ", `("${bufferToHexString(chunk)}")`, chunk);
			peer.send(chunk.toString());
			callback();
		},
	});

	return { stdin, stdout, stderr };
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function spawnShell(peer: Peer<any>) {
	const system = new System(createIO(peer));

	system.hostname = "exgen";

	shells.set(peer.id, system.shell);

	system.userSystem.login("jamie", "password123");

	system.fileSystem.currentDirectory = "/home/jamie";

	system.shell.printMotd();
	system.shell.printPrompt();

	return system.shell;
}

export default eventHandler({
	handler() {},

	websocket: {
		async open(peer) {
			console.log("[ws] open:", peer.id);

			// biome-ignore lint/suspicious/noExplicitAny:Hotfix
			spawnShell(peer as unknown as Peer<any>);
			console.log("[ws] finished open");
		},

		async message(peer, msg) {
			const message = msg.text();

			shells.get(peer.id)?.stdin.push(message);
		},

		async close(peer, details) {
			console.log("[ws] close:", peer.id, peer.url);
			shells.delete(peer.id);
		},
		async error(peer, error) {
			console.log("[ws] error:", peer.id, peer.url, error);
		},
	},
});
